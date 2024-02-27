package com.Dash.Dashboard.Controllers;

import com.Dash.Dashboard.Models.Project;
import com.Dash.Dashboard.Services.DashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static com.Dash.Dashboard.Services.DashboardService.isPresent;


@Slf4j
@RestController
@RequestMapping("/my-dashboard")
//@CrossOrigin
public class DashboardController {

    final private DashboardService dashboardService;
    final private ApplicationEventPublisher loginEventPublisher;

    @Autowired
    DashboardController(DashboardService dashboardService, ApplicationEventPublisher loginEventPublisher) {
        this.dashboardService = dashboardService;
        this.loginEventPublisher = loginEventPublisher;
    }



    /**
     * Fetches and returns a list of projects for the user upon dashboard initialization. Utilizes OAuth2 authentication
     * details to access the resource server.
     *
     * @param authorizedClient The OAuth2 authorized client, injected with authorization details for resource server calls.
     * @param oidcUser The OIDC authenticated user, obtained after OAuth2 authentication. This parameter is optional and specific to OIDC providers.
     * @return ResponseEntity containing a list of {@link Project} objects for the authenticated user, or an appropriate HTTP status code in case of errors or empty data.
     */
    @GetMapping
    public ResponseEntity<List<Project>> loadDashboardForGoogleClient(@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                                      OAuth2AuthorizedClient authorizedClient,
                                                                      @AuthenticationPrincipal OidcUser oidcUser) {
        try {

            // authorizedClient -> injected with authorization details to make calls to my Resource server
            // oidcUser -> injected after authentication with OAuth2 server (AuthenticationPrincipal) (OPTIONAL)

            final Optional<List<Project>> projectList;

            log.warn(authorizedClient.getAccessToken().getTokenValue());

            // TODO publish event to create user OR ensure user email doesnt alr exist in our IN-HOUSE-USER DB
            if (!isPresent(oidcUser)) {
                log.warn("Github");
                projectList = dashboardService.loadAllProjects(authorizedClient, "");
            } else if (isPresent(oidcUser.getEmail())) {
                log.warn("Google");
                //loginEventPublisher.publishEvent(new OAuthUserLoginEvent(oidcUser));
                projectList = dashboardService.loadAllProjects(authorizedClient, oidcUser.getEmail());
            } else {
                log.warn("DASH-OIDC");
                projectList = dashboardService.loadAllProjects(authorizedClient, authorizedClient.getPrincipalName());
            }


            if (projectList.isPresent() && !projectList.get().isEmpty()) {
                return ResponseEntity.ok().header("Content-Type", "application/json").
                        body(projectList.get());
            }

            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);

        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    // TODO ---> HOW DO WE HAVE CLIENT INJECTED AUTO? *****************
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
                                                 @RequestPart("csv-file") MultipartFile csvFile) {
                                                 //@RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                 //OAuth2AuthorizedClient authorizedClientConfig) { // TODO - UNCOMMENT
        try {

            // TODO - UNDER CONSTRUCTION
            if (true) return new ResponseEntity<>(new Project(), HttpStatus.OK);

            // Ensure request can be made by user
            if (!dashboardService.userHasEnoughCredits("userId")) {
                log.warn("You do not sufficient credits to create a new project ... ");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            final Optional<Project> generatedProjectConfig = dashboardService.createProject(projectName, projectDescription, csvFile); //, authorizedClientConfig);

            if (generatedProjectConfig.isPresent() && !generatedProjectConfig.get().getWidgets().isEmpty()) {
                return new ResponseEntity<>(generatedProjectConfig.get(), HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);

        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
