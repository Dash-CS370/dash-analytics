package com.Dash.ResourceServer.Utils;

import com.Dash.ResourceServer.Models.DataOperations;
import com.Dash.ResourceServer.Models.GraphType;
import com.Dash.ResourceServer.Models.Widget;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;


@Slf4j
@Component
public class OpenAIUtils {


    // FIXME ~~~~~~~~~~~~~~~~~ WORKS WELL ~~~~~~~~~~~~ SHORTEN PROMPT?
    public static String generatePrompt(String projectDescription, List<String> columnDescriptions) {

        final String BASE_PROMPT = "\n\nUsing the GenerateWidgetList function, generate 15 DIVERSE configuration options for graph " +
                "widgets based on the following dataset description (ONLY RETURN A JSON OBJECT CALLED \"widgets\"): ";

        // TODO TEMP
        projectDescription = "\nMy dataset deals with air-quality data. It contains hourly readings of particulate matter concentrations in the city.";
        // TODO TEMP
        columnDescriptions =
                List.of( // TODO frontend must populate these strings for me this format
                        "column-name: date, column-datatype: datetime, description: hourly timestamps of when particulate matter readings were taken",
                        "column-name: temperature, column-datatype: double, description: temperature readings of environment",
                        "column-name: pm10, column-datatype: double, description: concentration of particulate matter of size 10 mm or smaller",
                        "column-name: pm25, column-datatype: double, description: concentration of particulate matter of size 2.5 mm or smaller"
                );

        String prompt = BASE_PROMPT + projectDescription;

        // Add column descriptions
        prompt += "\n\nThe following is information on each column:";

        for (String columnDescription : columnDescriptions) {
            prompt = prompt.concat("\n" + columnDescription);
        }


        // Reference graph types and widget information
        prompt += "\n\nEach configuration option should ALWAYS include a 'title', 'graph_type', 'data_operations', and 'required_columns'. " +
                "The title should be a concise string accurately describing the graph. The graph type should be a string chosen from specified options, followed by data operations and the required columns to create the graph";

        for (GraphType graphType : GraphType.values()) {
            prompt = prompt.concat(graphType + ", ");
        }


        // List data operations to choose from
        prompt += "\n\nThe data operations should be a list of strings that represent operations to perform on the data. " +
                "These operations will manipulate the data to calculate more useful metrics to be graphed. The data operations should be chosen from the following options (the string must match spelling and case):\n";

        for (DataOperations dataOperation : DataOperations.values()) {
            prompt = prompt.concat(dataOperation + ", ");
        }

        return prompt;
    }



    // TODO
    public static Optional<List<Widget>> extractWidgets(String response) {

        if (!response.startsWith("{")) {
            response = response.substring(response.indexOf("{"), response.lastIndexOf("}") + 1).strip();
            log.warn("CLEANED RESPONSE: \n" + response);
        }

        // Prepare JSON serializer
        final TypeReference<List<Widget>> widgetListTypeReference = new TypeReference<List<Widget>>() {};

        final ObjectMapper objectMapper = new ObjectMapper();

        try {
            // TODO have this main be the main logic?
            if (!response.contains("widgets")) {
                String alt = response.substring(response.indexOf("["), response.lastIndexOf("]") + 1).strip();
                return Optional.ofNullable(objectMapper.readValue(alt, widgetListTypeReference));
            }

            return Optional.ofNullable(objectMapper.readValue(objectMapper.readTree(response).get("widgets").toString(), widgetListTypeReference));

        } catch (JsonProcessingException e) {
            log.warn(e.getMessage());
            return Optional.empty();
        }
    }


}
