package com.Dash.Dashboard.Controllers;

import com.Dash.Dashboard.Entites.UserType;
import com.Dash.Dashboard.Event.Listener.OAuth2UserLoginEventListener;
import com.Dash.Dashboard.Event.OAuth2UserLoginEvent;
import com.Dash.Dashboard.Exceptions.NotEnoughCreditsException;
import com.Dash.Dashboard.Exceptions.UserAlreadyExistsException;
import com.Dash.Dashboard.Models.Project;
import com.Dash.Dashboard.Services.DashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClientException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/my-dashboard")
//@CrossOrigin
public class DashboardController {


    private final DashboardService dashboardService;


    @Autowired
    DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }


    /**
     * Fetches and returns a list of projects for the user upon dashboard initialization. Utilizes OAuth2 authentication
     * details to access the resource server.
     *
     * param authorizedClient The OAuth2 authorized client, injected with authorization details for resource server calls.
     * param oidcUser The OIDC authenticated user, obtained after OAuth2 authentication. This parameter is optional and specific to OIDC providers.
     * @return ResponseEntity containing a list of {@link Project} objects for the authenticated user, or an appropriate HTTP status code in case of errors or empty data.
     */
    @GetMapping
    public ResponseEntity<List<Project>> loadDashboard(@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                       OAuth2AuthorizedClient authorizedClient,
                                                       @AuthenticationPrincipal OidcUser oidcUser) {
        try {

            final Optional<List<Project>> projectList;

            projectList = dashboardService.loadAllProjects(authorizedClient, oidcUser);

            if (projectList.isPresent() && !projectList.get().isEmpty()) {
                return ResponseEntity.ok().header("Content-Type", "application/json").
                       body(projectList.get());
            }

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (UserAlreadyExistsException e) {
            log.warn(e.getMessage());
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (WebClientResponseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        }
    }




    /**
     * Handles the creation of a new project by processing provided project details and an optional CSV file.
     *
     * @param projectName The name of the project to be created.
     * @param projectDescription A description of the project.
     * @param csvFile An optional CSV file containing project data.
     * @return ResponseEntity containing a {@link Project} object, or an appropriate HTTP status code in case of errors or empty data.
     */
    @PostMapping(value = "/create-project", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Project> createProject(@RequestPart("project-name") String projectName,
                                                 @RequestPart("project-description") String projectDescription,
                                                 @RequestPart("csv-file") MultipartFile csvFile) { //,
                                                 //@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                 //OAuth2AuthorizedClient authorizedClient) { // TODO - UNCOMMENT
        try {

            // Ensure request can be made by user
            dashboardService.verifyUserCreditCount("georgepm20002@gmail.com");

            final Optional<Project> generatedProjectConfig = dashboardService.createProject(null, projectName, projectDescription, csvFile);

            if (generatedProjectConfig.isPresent() && !generatedProjectConfig.get().getWidgets().isEmpty()) {
                return new ResponseEntity<>(generatedProjectConfig.get(), HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (NotEnoughCreditsException e) {
            log.warn("You do not sufficient credits to create a new project ... ");
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        } catch (WebClientResponseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        }
    }




    // TODO ------------------->
    @PutMapping(value = "/update-projects", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Object> updateProjects(@RequestPart("updated-projects") List<Project> projects) { //,
                                                 //@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                 //OAuth2AuthorizedClient authorizedClient) { // TODO - UNCOMMENT
        try {

            final Optional<Object> thing = dashboardService.updateProjects(projects);

            if (thing.isPresent()) {
                return new ResponseEntity<>(thing.get(), HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (WebClientResponseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        }
    }



    @DeleteMapping(value = "/delete-project", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> deleteProject(@RequestPart("project-key") String projectKey) { //,
                                                //@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                //OAuth2AuthorizedClient authorizedClient) {
        try {

            final String REGEX = "[0-9A-Za-z]+@[A-Za-z]+\\.com/project-[A-Za-z0-9-]+/[A-Za-z0-9-]+\\.csv";

            if (!projectKey.matches(REGEX)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            final Optional<String> projectDeletionConfirmation = dashboardService.deleteProject(null, projectKey);

            if (projectDeletionConfirmation.isPresent()) {
                return new ResponseEntity<>(HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);

        } catch (WebClientException e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
