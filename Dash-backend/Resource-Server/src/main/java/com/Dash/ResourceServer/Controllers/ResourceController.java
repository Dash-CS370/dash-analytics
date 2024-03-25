package com.Dash.ResourceServer.Controllers;

import com.Dash.ResourceServer.Models.DataOperations;
import com.Dash.ResourceServer.Models.GraphType;
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
@RequestMapping("/resources/api")
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
     * @param project
     * @param csvFile
     * @return
     */
    @PostMapping(value = "/generate-project", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Optional<Project> addProject(@RequestPart("template-project") Project project,
                                        @RequestPart("csv-file") MultipartFile csvFile) {
        try {

            // TODO Create Config with GPT API
            // final Optional<Project> generatedProjectConfig = openAPIService.generateProjectConfig(templateProject.getProjectDescription(), templateProject.getColumnDescriptions());
            // final Optional<List<Widget>> widgets = openAIService.generateWidgetConfigs();

            //if (widgets.isEmpty()) {
            if (false) {
                log.error("GPT API COULD NOT GENERATE CONFIGS");
                return Optional.empty();
            }

            //project.setWidgets(widgets.get());
            project.setWidgets(
                    List.of(
                            new Widget("Graph 1",
                                    GraphType.BAR_GRAPH,
                                    List.of(DataOperations.AVERAGE_N_ROWS, DataOperations.DROP_NAN_ROWS),
                                    List.of("Column 1", "Column 2", "Column 3")),

                            new Widget("Graph 2",
                                    GraphType.LINE_GRAPH,
                                    List.of(DataOperations.AVERAGE_N_ROWS, DataOperations.SLICE),
                                    List.of("Column 4", "Column 5", "Column 6"))
                    )
            );

            // FIXME -> ASYNC
            resourceService.uploadProjectFiles(project, csvFile);

            return Optional.of(project);

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



    /**
     * Delete the user ids directory Or everything inside the project (csv files and json config files)
     */
    @DeleteMapping("/delete-user")
    public Optional<String> deleteAllUserResources(@RequestParam String userId) {
        try {

            return resourceService.deleteAllUserResources(userId);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }


}
