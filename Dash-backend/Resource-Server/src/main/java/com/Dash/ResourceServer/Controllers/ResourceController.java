package com.Dash.ResourceServer.Controllers;

import com.Dash.ResourceServer.Models.Project;
import com.Dash.ResourceServer.Models.Widget;
import com.Dash.ResourceServer.Services.GPTService;
import com.Dash.ResourceServer.Services.S3Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/resources/api")
public class ResourceController {

    private final S3Service resourceService;

    private final GPTService gptService;

    @Autowired
    ResourceController(S3Service resourceService, GPTService gptService) {
        this.resourceService = resourceService;
        this.gptService = gptService;
    }



    /** TODO
     * Retrieves the JSON configuration file located at user/project-{userId}/{userId}.json, which encapsulates the dashboard & widgets configuration for a specified project, including pertinent links and information in JSON format
     *
     * @param userId
     * @return
     */
    @GetMapping(value = "/all-projects/{userId}")
    public List<Project> getUserProjects(@PathVariable String userId) {
        try {

            return resourceService.getProjectsBelongingTo(userId);

        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }




    /** TODO
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
            final Optional<Project> generatedProjectConfig = gptService.promptGptWith(templateProject);

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




    /** TODO
     *
     * @param projectKey
     * @return
     */
    @DeleteMapping(value = "/delete-project/{project-key}")
    public Optional<String> deleteProject(@PathVariable("project-key") String projectKey) {
        try {

            String decodedProjectKey = URLDecoder.decode(projectKey, StandardCharsets.UTF_8);

            final String REGEX = "[0-9A-Za-z]+@[A-Za-z]+\\.com/project-[A-Za-z0-9-]+/[A-Za-z0-9-]+\\.csv";

            if (!decodedProjectKey.matches(REGEX)) {
                return Optional.empty();
            }

            return resourceService.deleteProject(decodedProjectKey);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }




}
