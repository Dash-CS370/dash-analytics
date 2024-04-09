package com.Dash.ResourceServer.Utils;

import com.Dash.ResourceServer.Models.GraphType.ColumnCategory;
import com.Dash.ResourceServer.Models.DataOperations;
import com.Dash.ResourceServer.Models.GraphType;
import com.Dash.ResourceServer.Models.Widget;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Component
public class OpenAIUtils {


    private static final Integer PIN_COUNT = 4;


    // TODO
    public static String generatePrompt(String datasetDescription, List<String> columnDescriptions) {

        final String BASE_PROMPT = "\nUsing the GenerateWidgetList function, generate UP TO 20 DISTINCT configuration options for graph " +
                                   "widgets BASED ON THE FOLLOWING DATASET & COLUMN DESCRIPTIONS (ONLY RETURN A JSON OBJECT CALLED \"widgets\"):\n";

        String prompt = BASE_PROMPT + datasetDescription;

        // Add column descriptions to prompt
        prompt += "\n\nThe following is information on each column. Be considerate of the column category and type of data that each column holds: ";

        String joinedDescriptions = "";
        for (String columnDescription : columnDescriptions) {
            joinedDescriptions += "\n" + columnDescription;
        }

        prompt += joinedDescriptions;

        log.warn(prompt);

        return prompt;
    }



    public static String additionalSystemContext() {
        String additionalContext;

        /*
        // General context and list of graph types to choose from
        additionalContext =
                "Each configuration option (aka Widget) must include 'title', 'graph_type', 'description', and 'column_data_operations'. " +
                "'title' is a concise string describing the graph. A singular 'graph_type' is chosen from specified options, 'description' provides a brief overview of the visualization in present tense. " +
                "The 'column_data_operations' maps required columns to their data operations, detailing how each column is processed to generate the graph." +
                "For each widget, the graph_type REQUIREMENTS MUST BE MET and CAN ONLY be chosen from the following options (the string must match spelling and case):";
        */

        additionalContext =
                "Each configuration option (aka Widget) MUST include 'title', 'graph_type', 'description', and 'columns'. " +
                        "'title' is a concise string describing the graph (NO MORE THAN 25 CHARACTERS). A singular 'graph_type' is chosen from specified options, 'description' provides a brief overview of the visualization in present tense. " +
                        "The 'columns' is a list of the required columns needed to generate a widget of the given graph type." +
                        "For each widget, the graph_type REQUIREMENTS MUST BE MET and CAN ONLY be chosen from the following options (the string must match spelling and case):";

        for (GraphType graphType : GraphType.values()) {
            additionalContext = additionalContext.concat(graphType.getValue() + ": " + graphType.getDescription() + ", ");
        }


        /*
        // List data operations to choose from
        additionalContext += ". The data operations should be a list of strings that represent operations to perform on a column(s). " +
                "These operations will manipulate the data to calculate more useful metrics to be graphed. " +
                "The data operations CAN ONLY be chosen from the following options (THE STRING MUST MATCH SPELLING AND CASE):";

        for (DataOperations dataOperation : DataOperations.values()) {
            additionalContext = additionalContext.concat(dataOperation.getValue() + ": " + dataOperation.getDescription() + ", ");
        }
        */

        additionalContext += ". The column descriptions should include a list of strings that represent the category of represented data they fall under, given below"
        + ". Use these descriptions and categories to better choose Widget graphs and columns";

        // Column categories
        for (GraphType.ColumnCategory columnCategory : GraphType.ColumnCategory.values()) {
            additionalContext = additionalContext.concat(columnCategory.getValue() + ": " + columnCategory.getDescription() + ", ");
        }

        return additionalContext;
    }



    public static Optional<List<Widget>> extractWidgets(String response) {

        final List<Widget> processedWidgets;

        if (!response.startsWith("{")) {
            response = response.substring(response.indexOf("{"), response.lastIndexOf("}") + 1).strip();
            log.warn("CLEANED RESPONSE: \n" + response);
        }

        final TypeReference<List<Widget>> widgetListTypeReference = new TypeReference<List<Widget>>() {};

        final ObjectMapper objectMapper = new ObjectMapper();

        try {

            final List<Widget> widgets;

            if (!response.contains("widgets")) {
                String alt = response.substring(response.indexOf("["), response.lastIndexOf("]") + 1).strip();
                widgets = objectMapper.readValue(alt, widgetListTypeReference);
            } else {
                widgets = objectMapper.readValue(objectMapper.readTree(response).get("widgets").toString(), widgetListTypeReference);
            }

            if (widgets == null) return Optional.empty();

            log.warn("BEFORE FILTER SIZE: " + widgets.size());

            processedWidgets = processWidgetList(widgets);

            log.warn("AFTER FILTER SIZE: " + processedWidgets.size());

            return Optional.of(processedWidgets);

        } catch (JsonProcessingException e) {
            // TODO return preset
            log.warn(e.getMessage());
            return Optional.empty();
        }
    }




    public static List<Widget> processWidgetList(List<Widget> unprocessedWidgets) {
        // TODO
        final List<Widget> widgets = unprocessedWidgets.stream()
                .filter(widget -> widget.getTitle() != null && !widget.getTitle().isEmpty())
                .filter(widget -> widget.getGraphType() != null && Arrays.asList(GraphType.values()).contains(widget.getGraphType()))
                .filter(widget -> widget.getDescription() != null && !widget.getDescription().isEmpty())
                .filter(widget -> widget.getColumns() != null)
                .filter(widget -> widget.getGraphType() == GraphType.LINE_GRAPH)
                //.filter(widget -> widget.getGraphType() == GraphType.LINE_GRAPH || widget.getGraphType() == GraphType.BAR_GRAPH) // FIXME
                .filter(widget -> widget.getColumns().size() >= 2)
                //.filter(widget -> widget.getColumnDataOperations() != null)
                //.filter(widget -> {
                    //boolean isMultiColumnGraph = List.of(GraphType.LINE_GRAPH, GraphType.BAR_GRAPH, GraphType.SCATTER_PLOT, GraphType.PIE_CHART).contains(widget.getGraphType()) && widget.getColumnDataOperations().keySet().size() >= 2;
                    //boolean isMultiColumnGraph = List.of(GraphType.LINE_GRAPH, GraphType.BAR_GRAPH, GraphType.SCATTER_PLOT, GraphType.PIE_CHART).contains(widget.getGraphType()) && widget.getColumnDataOperations().keySet().size() >= 2;
                    //return isMultiColumnGraph || isSingleColumnGraph;
                //})
                .collect(Collectors.toList());


        // Assign each Widget a Unique Identifier
        /*
        widgets.forEach(widget -> {
            widget.setId(UUID.randomUUID().toString().substring(0, 8));
        });

        // Enable pinning for the first N random widgets
        Collections.shuffle(widgets);

        for (int i = 0; i < PIN_COUNT; i++) {
            widgets.get(i).setPinned(true);
        }
        */

        return widgets;
    }



    public static String widgetSchema() {
        return "{"
                + "\"type\": \"array\","
                + "\"items\": {"
                + "  \"type\": \"object\","
                + "  \"properties\": {"
                + "    \"title\": {"
                + "      \"type\": \"string\""
                + "    },"
                + "    \"graph_type\": {"
                + "      \"type\": \"string\""
                + "    },"
                + "    \"description\": {"
                + "      \"type\": \"string\""
                + "    },"
                + "    \"columns\": {"
                + "      \"type\": \"array\","
                + "      \"items\": {"
                + "        \"type\": \"string\""
                + "      }"
                + "    }"
                + "  },"
                + "  \"required\": [\"title\", \"graph_type\", \"description\", \"columns\"]"
                + "}"
                + "},"
                + "\"required\": [\"widgets\"]"
                + "}";
    }


    // FIXME
    public static String realWidgetSchema() {
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
                + "       \"description\": {"
                + "         \"type\": \"string\""
                + "       },"
                + "       \"column_data_operations\": {"
                + "         \"type\": \"object\","
                + "         \"additionalProperties\": {"
                + "           \"type\": \"array\","
                + "           \"items\": {"
                + "             \"type\": \"string\""
                + "           }"
                + "         }"
                + "       }"
                + "     },"
                + "     \"required\": [\"title\", \"graph_type\", \"description\", \"column_data_operations\"]"
                + "   }"
                + "},"
                + "\"required\": [\"widgets\"]"
            + "}";
    }


}
