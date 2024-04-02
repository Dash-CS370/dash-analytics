package com.Dash.ResourceServer.Utils;

import com.Dash.ResourceServer.Models.ColumnCategory;
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


    // TODO
    public static String generatePrompt(String projectDescription, List<String> columnDescriptions) {

        final String BASE_PROMPT = "\nUsing the GenerateWidgetList function, generate 20 DISTINCT configuration options for graph " +
                                   "widgets BASED ON THE FOLLOWING DATASET & COLUMN DESCRIPTIONS (ONLY RETURN A JSON OBJECT CALLED \"widgets\"):\n";

        String prompt = BASE_PROMPT + projectDescription;

        // Add column descriptions to prompt
        prompt += "\n\nThe following is information on each column. Be considerate of the column category and type of data that each column holds: ";

        String joinedDescriptions = "";
        for (String columnDescription : columnDescriptions) {
            joinedDescriptions += "\n" + columnDescription;
        }

        prompt += joinedDescriptions;

        /*
        prompt += "\n\nThe following are the first 5 rows of data from the CSV sheet. Be considerate of type of data that each row holds as well as the column names: \n";
        prompt += columnDescriptions.get("csv");
        */

        log.warn(prompt);

        return prompt;
    }



    public static String additionalSystemContext() {
        String additionalContext;

        /*
        // General context and list of graph types to choose from
        additionalContext =
                "Each configuration option (aka Widget) must include 'title', 'graph_type', 'widget_description', and 'column_data_operations'. " +
                "'title' is a concise string describing the graph. A singular 'graph_type' is chosen from specified options, 'widget_description' provides a brief overview of the visualization in present tense. " +
                "The 'column_data_operations' maps required columns to their data operations, detailing how each column is processed to generate the graph." +
                "For each widget, the graph_type REQUIREMENTS MUST BE MET and CAN ONLY be chosen from the following options (the string must match spelling and case):";
        */

        additionalContext =
                "Each configuration option (aka Widget) must include 'title', 'graph_type', 'widget_description', and 'columns'. " +
                        "'title' is a concise string describing the graph. A singular 'graph_type' is chosen from specified options, 'widget_description' provides a brief overview of the visualization in present tense. " +
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
        for (ColumnCategory columnCategory : ColumnCategory.values()) {
            additionalContext = additionalContext.concat(columnCategory.getValue() + ": " + columnCategory.getDescription() + ", ");
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

            if (potentialWidgets == null) return Optional.empty();

            // Filter widgets
            filteredWidgets = filterWidgetList(potentialWidgets);

            return Optional.of(filteredWidgets);

        } catch (JsonProcessingException e) {
            // TODO return preset
            log.warn(e.getMessage());
            return Optional.empty();
        }
    }




    public static List<Widget> filterWidgetList(List<Widget> widgets) {
        return widgets.stream()
                .filter(widget -> widget.getTitle() != null && !widget.getTitle().isEmpty())
                .filter(widget -> widget.getGraphType() != null && Arrays.asList(GraphType.values()).contains(widget.getGraphType()))
                .filter(widget -> widget.getWidgetDescription() != null && !widget.getWidgetDescription().isEmpty())
                //.filter(widget -> widget.getColumnDataOperations() != null)
                .filter(widget -> widget.getColumns() != null)
                //.filter(widget -> {
                    //boolean isMultiColumnGraph = List.of(GraphType.LINE_GRAPH, GraphType.BAR_GRAPH, GraphType.SCATTER_PLOT, GraphType.PIE_CHART).contains(widget.getGraphType()) && widget.getColumnDataOperations().keySet().size() >= 2;
                    //boolean isMultiColumnGraph = List.of(GraphType.LINE_GRAPH, GraphType.BAR_GRAPH, GraphType.SCATTER_PLOT, GraphType.PIE_CHART).contains(widget.getGraphType()) && widget.getColumnDataOperations().keySet().size() >= 2;
                    //return isMultiColumnGraph || isSingleColumnGraph;
                //})
                .collect(Collectors.toList());
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
                + "    \"widget_description\": {"
                + "      \"type\": \"string\""
                + "    },"
                + "    \"columns\": {"
                + "      \"type\": \"array\","
                + "      \"items\": {"
                + "        \"type\": \"string\""
                + "      }"
                + "    }"
                + "  },"
                + "  \"required\": [\"title\", \"graph_type\", \"widget_description\", \"columns\"]"
                + "}"
                + "},"
                + "\"required\": [\"widgets\"]"
                + "}";
    }


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
                + "       \"widget_description\": {"
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
                + "     \"required\": [\"title\", \"graph_type\", \"widget_description\", \"column_data_operations\"]"
                + "   }"
                + "},"
                + "\"required\": [\"widgets\"]"
            + "}";
    }


}
