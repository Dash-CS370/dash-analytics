package com.Dash.Dashboard.Controllers;

import com.Dash.Dashboard.Exceptions.NotEnoughCreditsException;
import com.Dash.Dashboard.Exceptions.UserAlreadyExistsException;
import com.Dash.Dashboard.Models.Project;
import com.Dash.Dashboard.OAuth2.CustomAuthUser;
import com.Dash.Dashboard.Services.DashboardService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Optional;


@Slf4j
@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/dashboards")
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

            //log.warn(oauth2User.getAttributes().toString());

            final Optional<List<Project>> projectList = dashboardService.loadAllProjects(authorizedClient, oauth2User);

            return projectList.map(projects -> ResponseEntity.ok().header("Content-Type", "application/json")
                        .body(projects)).orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));

        } catch (UserAlreadyExistsException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (WebClientResponseException e) {
            log.warn(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            log.warn(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    /**
     * Handles the creation of a new project by processing provided project details and an optional CSV file.
     *
     * @param projectTitle The name of the project to be created.
     * @param datasetDescription A description of the project.
     /
     * @param csvFile An optional CSV file containing project data.
     * @return ResponseEntity containing a {@link Project} object, or an appropriate HTTP status code in case of errors or empty data.
     */
    @PostMapping(value = "/project", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Project createProject(@RequestPart("project-name") String projectTitle,
                                                 @RequestPart("dataset-description") String datasetDescription,
                                                 @RequestPart("column-descriptions") String columnDescriptions,
                                                 @RequestPart("csv-file") MultipartFile csvFile,
                                                 @RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                 OAuth2AuthorizedClient authorizedClient,
                                                 @AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            log.warn("FORM DATA UPLOADED");
            // Ensure request can be made by user
            final Optional<Project> generatedProject = dashboardService.createProject(authorizedClient, oauth2User, projectTitle,
                                                                                      datasetDescription, columnDescriptions, csvFile);

            if (generatedProject.isPresent() && !generatedProject.get().getWidgets().isEmpty()) {
                return generatedProject.get();
            }

            return new Project();

        } catch (NotEnoughCreditsException e) {
            log.warn("You do not sufficient credits to create a new project ... ");
            //return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
            return new Project();
        } catch (WebClientResponseException e) {
           // return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
            return new Project();
        } catch (JsonProcessingException e) {
           // return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            return new Project();
        }
    }




    /**
     *
     * @param projects List of projects that have been altered
     * @return ResponseEntity containing confirmation of request success
     */
    @PutMapping(value = "/projects", consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> updateProjects(@RequestBody List<Project> projects,
                                                 @RegisteredOAuth2AuthorizedClient("resource-access-client")
                                                 OAuth2AuthorizedClient authorizedClient) {
        try {

            dashboardService.updateProjects(authorizedClient, projects);

            return new ResponseEntity<>(HttpStatus.ACCEPTED);

        } catch (WebClientResponseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        }
    }



    /**
     *
     * @param projectId Project identifier used to query and remove Object from S3
     * @return Object confirming deletion
     */
    @DeleteMapping(value = "/project")
    public ResponseEntity<?> deleteProject(@RequestParam("project-id") String projectId,
                                           @RegisteredOAuth2AuthorizedClient("resource-access-client")
                                           OAuth2AuthorizedClient authorizedClient,
                                           @AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            log.warn("Deletion started...");
            dashboardService.deleteProject(authorizedClient, oauth2User, projectId);

            return new ResponseEntity<>(HttpStatus.OK);

        } catch (WebClientResponseException e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/test")
    public String foo(@AuthenticationPrincipal OAuth2User oauth2User) {
        return "INSIDE PROTECTED ENDPOINT, WELCOME " + (new CustomAuthUser(oauth2User)).getEmail();
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/resource")
    public String boo() {
        return dashboardService.hitResourceController();
    }


}
