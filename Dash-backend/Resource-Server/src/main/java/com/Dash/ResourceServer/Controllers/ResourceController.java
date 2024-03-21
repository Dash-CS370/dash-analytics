package com.Dash.ResourceServer.Controllers;

import com.Dash.ResourceServer.Models.Project;
import com.Dash.ResourceServer.Models.Widget;
import com.Dash.ResourceServer.Services.OpenAPIService;
import com.Dash.ResourceServer.Services.ResourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/resources/api")
public class ResourceController {

    private final ResourceService resourceService;

    private final OpenAPIService openAPIService;

    @Autowired
    ResourceController(ResourceService resourceService, OpenAPIService openAPIService) {
        this.resourceService = resourceService;
        this.openAPIService = openAPIService;
    }



    /**
     * Retrieves the JSON configuration file located at user/project-{userId}/{userId}.json, which encapsulates the dashboard & widgets configuration for a specified project, including pertinent links and information in JSON format
     *
     * @param userAccount
     * @return
     */
    @GetMapping(value = "/all-projects/{userAccount}")
    public List<Project> getUserProjects(@PathVariable String userAccount) {
        try {

            return resourceService.getProjectsBelongingTo(userAccount);

        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }



    /**
     * Generates a new project directory with a CSV sheet file and a generated JSON config file that includes the dashboard & widgets setup, and relevant links, derived from the template Project config
     *
     * @param templateProject
     * @param csvFile
     * @return
     */
    @PostMapping(value = "/generate-project", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Optional<Project> addProject(@RequestPart("template-project") Project templateProject,
                                        @RequestPart("csv-file") MultipartFile csvFile) {
        try {

            // TODO Create Config with GPT API
            //final String generatedProjectConfig = gptService.promptGpt(project);
            final Optional<Project> generatedProjectConfig = openAPIService.promptGptWith(templateProject);

            if (generatedProjectConfig.isEmpty()) {
                log.error("GPT API COULD NOT GENERATE CONFIG");
                // TODO generate default widgets??
                List<Widget> defaultWidgets = new ArrayList<>(6);
                templateProject.setWidgets(defaultWidgets);
                resourceService.uploadProjectFiles(templateProject, csvFile);
                return Optional.of(templateProject);
            }

            resourceService.uploadProjectFiles(generatedProjectConfig.get(), csvFile);

            return generatedProjectConfig;

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }



    /**
     * @return
     */
    @PutMapping(value = "/update-projects")
    public Optional<Object> updateProjects(@RequestBody List<Project> projects) {
        try {

            return resourceService.updateProjects(projects);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }



    /**
     *
     * @param projectId
     * @return
     */
    @DeleteMapping(value = "/delete-project")
    public Optional<String> deleteProject(@RequestParam("user-id") String userId,
                                          @RequestParam("project-id") String projectId) {
        try {

            return resourceService.deleteProject(userId, projectId);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }



    // TODO - VERA
    /**
     * Delete the user ids directory Or everything inside the project (csv files and json config files)
     */
    @DeleteMapping("/delete-user")
    public Optional<String> deleteAllUserResources(@RequestParam String userId) {
        try {

            return resourceService.deleteUserAccount(userId);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }

}
