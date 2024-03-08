package com.Dash.Dashboard.Controllers;

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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
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
     * @param authorizedClient The OAuth2 authorized client, injected with authorization details for resource server calls.
     * @param oauth2User The OAuth2 authenticated user, obtained after OAuth2 authentication.
     * @return ResponseEntity containing a list of {@link Project} objects for the authenticated user, or an appropriate HTTP status code in case of errors or empty data.
     */
    @GetMapping
    public ResponseEntity<List<Project>> loadDashboard(@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                       OAuth2AuthorizedClient authorizedClient,
                                                       @AuthenticationPrincipal OAuth2User oauth2User) {
        try {

            final Optional<List<Project>> projectList = dashboardService.loadAllProjects(authorizedClient, oauth2User);

            return projectList.map(projects -> ResponseEntity.ok().header("Content-Type", "application/json")
                        .body(projects)).orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));

        } catch (UserAlreadyExistsException e) {
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
                                                 //OAuth2AuthorizedClient authorizedClient,
                                                 //@AuthenticationPrincipal OAuth2User oauth2User) { // TODO - UNCOMMENT
        try {

            // Ensure request can be made by user
            final Optional<Project> generatedProject = dashboardService.createProject(null, null,
                                                                                            projectName, projectDescription, csvFile);

            if (generatedProject.isPresent() && !generatedProject.get().getWidgets().isEmpty()) {
                return new ResponseEntity<>(generatedProject.get(), HttpStatus.CREATED);
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
    /**
     *
     * @param projects
     * @return
     */
    @PutMapping(value = "/update-projects", consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Object> updateProjects(@RequestBody List<Project> projects) { //,
                                                 //@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                 //OAuth2AuthorizedClient authorizedClient,
                                                 //@AuthenticationPrincipal OAuth2User oauth2User) { // TODO - UNCOMMENT
        try {
            final Optional<Object> updatedProjectsConfirmation = dashboardService.updateProjects(projects);

            if (updatedProjectsConfirmation.isPresent()) {
                return new ResponseEntity<>(HttpStatus.ACCEPTED);
            }

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (WebClientResponseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        }
    }



    /**
     *
     * @param projectId
     * @return
     */
    @DeleteMapping(value = "/delete-project")
    public ResponseEntity<String> deleteProject(@RequestParam("project-id") String projectId) {
                                                //@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                //OAuth2AuthorizedClient authorizedClient
                                                //@AuthenticationPrincipal OAuth2User oauth2User) {
        try {

            // TODO
            Optional<String> projectDeletionConfirmation = dashboardService.deleteProject(null, null, projectId);

            if (projectDeletionConfirmation.isPresent() && projectDeletionConfirmation.get().endsWith("/")) {
                return new ResponseEntity<>(projectDeletionConfirmation.get(), HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);

        } catch (WebClientResponseException e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
