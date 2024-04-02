package com.Dash.ResourceServer.Controllers;

import com.Dash.ResourceServer.Models.Project;
import com.Dash.ResourceServer.Models.Widget;
import com.Dash.ResourceServer.Services.Impl.OpenAIServiceImpl;
import com.Dash.ResourceServer.Services.ResourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {

    private final ResourceService resourceService;

    private final OpenAIServiceImpl openAIService;

    @Autowired
    ResourceController(ResourceService resourceService, OpenAIServiceImpl openAIService) {
        this.resourceService = resourceService;
        this.openAIService = openAIService;
    }


    /**
     * Retrieves the JSON configuration file located at user/project-{userId}/{userId}.json, which encapsulates the dashboard & widgets configuration for a specified project, including pertinent links and information in JSON format
     *
     * @param userAccount
     * @return
     */
    @GetMapping(value = "/projects/{userAccount}")
    public List<Project> getUserProjects(@PathVariable String userAccount) {
        try {
            log.warn("hello");
            return resourceService.getProjectsBelongingTo(userAccount);

        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }



    /**
     * Generates a new project directory with a CSV sheet file and a generated JSON config file that includes the dashboard & widgets setup, and relevant links, derived from the template Project config
     *
     * @param project
     * @param csvFile
     * @return
     */
    @PostMapping(value = "/project", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Optional<Project> addProject(@RequestPart("template-project") Project project,
                                        @RequestPart("csv-file") MultipartFile csvFile) {
        try {

            // Create Config with GPT API
            Optional<List<Widget>> widgets = Optional.empty();
            //Optional<List<Widget>> widgets = openAIService.generateWidgetConfigs(project.getProjectDescription(), project.getColumnDescriptions());

            // Try one more time
            if (widgets.isEmpty()) {
                //widgets = openAIService.generateWidgetConfigs(project.getProjectDescription(), project.getColumnDescriptions());
            }

            // TODO
            return widgets.map(widgetList -> {
                project.setWidgets(widgetList);
                resourceService.uploadProjectFiles(project, csvFile);
                return project;
            });

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }



    /**
     * @return
     */
    @PutMapping(value = "/projects")
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
    @DeleteMapping(value = "/project")
    public Optional<String> deleteProject(@RequestParam("user-id") String userId,
                                          @RequestParam("project-id") String projectId) {
        try {

            return resourceService.deleteProject(userId, projectId);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }



    /**
     * Delete the user ids directory Or everything inside the project (csv files and json config files)
     */
    @DeleteMapping("/user")
    public Optional<String> deleteAllUserResources(@RequestParam String userId) {
        try {

            return resourceService.deleteAllUserResources(userId);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }


}
