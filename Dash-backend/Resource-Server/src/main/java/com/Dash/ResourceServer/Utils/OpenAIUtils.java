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
import java.util.stream.Collectors;


@Slf4j
@Component
public class OpenAIUtils {


    // TODO
    public static String generatePrompt(String projectDescription, List<String> columnDescriptions) {

        final String BASE_PROMPT = "\nUsing the GenerateWidgetList function, generate 15 DISTINCT configuration options for graph " +
                                   "widgets BASED ON THE FOLLOWING DATASET & COLUMN DESCRIPTIONS (ONLY RETURN A JSON OBJECT CALLED \"widgets\"): ";

        String prompt = BASE_PROMPT + projectDescription;

        // Add column descriptions to prompt
        prompt += "\n\nThe following is information on each column:";

        final String joinedDescriptions = String.join("\n", columnDescriptions);

        prompt += "\n" + joinedDescriptions;

        return prompt;
    }



    public static String additionalSystemContext() {
        String additionalContext;

        // General context and list of graph types to choose from
        additionalContext =
                "Each configuration option must include 'title', 'graph_type', 'widget_description', and 'column_operations'. " +
                "'title' is a concise string describing the graph. A singular 'graph_type' is chosen from specified options, 'widget_description' provides a brief overview of the visualization. " +
                "'column_operations' maps required columns to their data operations, detailing how each column is processed to generate the graph:\n";

        for (GraphType graphType : GraphType.values()) {
            additionalContext = additionalContext.concat(graphType + ", ");
        }

        // List data operations to choose from
        additionalContext += " The data operations should be a list of strings that represent operations to perform on a column(s). " +
                "These operations will manipulate the data to calculate more useful metrics to be graphed. " +
                "The data operations should be chosen from the following options (the string must match spelling and case):\n";

        for (DataOperations dataOperation : DataOperations.values()) {
            additionalContext = additionalContext.concat(dataOperation + ", ");
        }

        return additionalContext;
    }



    public static Optional<List<Widget>> extractWidgets(String response) {

        final List<Widget> filteredWidgets;

        if (!response.startsWith("{")) {
            response = response.substring(response.indexOf("{"), response.lastIndexOf("}") + 1).strip();
            log.warn("CLEANED RESPONSE: \n" + response);
        }

        final TypeReference<List<Widget>> widgetListTypeReference = new TypeReference<List<Widget>>() {};

        final ObjectMapper objectMapper = new ObjectMapper();

        try {
            final List<Widget> potentialWidgets;

            if (response.contains("widgets")) {
                String alt = response.substring(response.indexOf("["), response.lastIndexOf("]") + 1).strip();
                potentialWidgets = objectMapper.readValue(alt, widgetListTypeReference);
            } else {
                potentialWidgets = objectMapper.readValue(objectMapper.readTree(response).get("widgets").toString(), widgetListTypeReference);
            }

            assert potentialWidgets != null;

            filteredWidgets = potentialWidgets.stream()
                    .filter(widget -> widget.getTitle() != null && !widget.getTitle().isEmpty())
                    .filter(widget -> widget.getGraphType() != null)
                    .filter(widget -> widget.getWidgetDescription() != null && !widget.getWidgetDescription().isEmpty())
                    .filter(widget -> widget.getColumnOperations() != null)
                    .collect(Collectors.toList());

            return Optional.of(filteredWidgets);

        } catch (JsonProcessingException e) {
            log.warn(e.getMessage());
            return Optional.empty();
        }
    }



    public static String widgetSchema() {
        return "{"
                + "   \"type\": \"array\","
                + "   \"items\": {"
                + "     \"type\": \"object\","
                + "     \"properties\": {"
                + "       \"title\": {"
                + "         \"type\": \"string\""
                + "       },"
                + "       \"graph_type\": {"
                + "         \"type\": \"string\""
                + "       },"
                + "       \"widget_description\": {"
                + "         \"type\": \"string\""
                + "       },"
                + "       \"column_operations\": {"
                + "         \"type\": \"object\","
                + "         \"additionalProperties\": {"
                + "           \"type\": \"array\","
                + "           \"items\": {"
                + "             \"type\": \"string\""
                + "           }"
                + "         }"
                + "       }"
                + "     },"
                + "     \"required\": [\"title\", \"graph_type\", \"widget_description\", \"column_operations\"]"
                + "   }"
                + "},"
                + "\"required\": [\"widgets\"]"
            + "}";
    }


}
