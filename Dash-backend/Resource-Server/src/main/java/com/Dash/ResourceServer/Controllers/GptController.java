package com.Dash.ResourceServer.Controllers;

import com.Dash.ResourceServer.Models.Project;
import com.Dash.ResourceServer.Models.Widget;
import com.Dash.ResourceServer.Services.Impl.TempDTO.RequestDTO;
import com.Dash.ResourceServer.Services.OpenAIService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Slf4j
@CrossOrigin(origins = "http://127.0.0.1:3000")
@RestController
@RequestMapping("/api/gpt")
public class GptController {

    private final Integer DEFAULT_RETRY_COUNT = 1;

    private final OpenAIService openAIService;

    @Autowired
    GptController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }


    // TODO TEMP
    @PostMapping()
    public List<Widget> demoWidgetGenerator(@RequestBody RequestDTO dataDTO) {
        // DTO -> "dataset description" | "column descriptions"
        log.warn("WIDGETS ENPINT");

        if (dataDTO.getDatasetDescription().isEmpty() || dataDTO.getDatasetDescription().isBlank())
            dataDTO.setDatasetDescription("My dataset deals with air-quality data. It contains hourly readings of particulate matter concentrations in the city.");

        if (dataDTO.getColumnData() == null || dataDTO.getColumnData().isEmpty()) {
            // FIXME frontend must populate these strings for me this format
            List<String> cols = List.of(
                    "column-name: date, column-datatype: datetime object, description: hourly timestamps of when particulate matter readings were taken, category: TEMPORAL",
                    "column-name: temperature, column-datatype: double, description: temperature readings of environment, category: NUMERICAL",
                    "column-name: pm10, column-datatype: double, description: concentration of particulate matter of size 10 mm or smaller, category: NUMERICAL",
                    "column-name: pm25, column-datatype: double, description: concentration of particulate matter of size 2.5 mm or smaller, category: NUMERICAL",
                    "column-name: humidity, column-datatype: double, description: moistness of environment, measured by precipitation and other factors, category: NUMERICAL"
            );

            dataDTO.setColumnData(cols);
        }

        return openAIService.attemptWidgetGenerationWithRetry(dataDTO.getDatasetDescription(), dataDTO.getColumnData(),
                                                              DEFAULT_RETRY_COUNT).orElseGet(ArrayList::new);
    }




    /**
     *
     * @param currentProject
     * @return
     */
    @PostMapping(value = "/generate")
    public Optional<List<Widget>> generateMoreWidgets(@RequestBody Project currentProject) {
        try {

            // LOGIC -> Passing in List of Previous Widgets (JUST THE TITLES) and WARN GPT NOT TO GENERATE IDENTICAL ONES
            return openAIService.attemptWidgetGenerationWithRetry(
                        currentProject.getDatasetDescription(), currentProject.getColumnDescriptions(), 1);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
        }
    }


}
