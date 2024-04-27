package com.Dash.ResourceServer.Controllers;

import com.Dash.ResourceServer.Models.Project;
import com.Dash.ResourceServer.Models.Widget;
import com.Dash.ResourceServer.Services.GptService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/v1/widgets")
public class GptController {

    private final Integer DEFAULT_RETRY_COUNT = 1;

    private final GptService gptService;

    @Autowired
    GptController(GptService gptService) {
        this.gptService = gptService;
    }


    /**
     *
     * @param currentProject
     * @return
     */
    @PostMapping(value = "/generate")
    public Optional<List<Widget>> generateMoreWidgets(@RequestBody Project currentProject) {
        try {

            return gptService.attemptWidgetGenerationWithRetry(
                        currentProject.getDatasetDescription(), currentProject.getColumnDescriptions(), DEFAULT_RETRY_COUNT);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }

}
