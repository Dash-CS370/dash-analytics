package com.Dash.ResourceServer.Utils;

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


    public static String additionalSystemContext() {

        String additionalContext =
                "Each configuration option (aka Widget) MUST include 'title', 'graph_type', 'description', and 'columns'. " +
                "'title' is a concise string describing the graph (NO MORE THAN 25 CHARACTERS). A singular 'graph_type' is chosen from specified options," +
                "'description' provides an insightful overview of the visualization in present tense. The 'columns' is a list of the required columns needed to " +
                "generate a widget of the given graph type. For each widget, the graph_type REQUIREMENTS MUST BE MET and CAN ONLY be chosen from the " +
                "following options (the string must match spelling and case):";

        for (GraphType graphType : GraphType.values()) {
            additionalContext = additionalContext.concat(graphType.getValue() + ": " + graphType.getDescription() + ", ");
        }

        additionalContext += ". The column descriptions should include a list of strings that represent the category of represented data they fall under, given below"
        + ". Use these descriptions and CATEGORIES for each column to appropriately choose Widget graphs and columns";

        // Column categories
        for (GraphType.ColumnCategory columnCategory : GraphType.ColumnCategory.values()) {
            additionalContext = additionalContext.concat(columnCategory.getValue() + ": " + columnCategory.getDescription() + ", ");
        }

        return additionalContext;
    }



    public static String generatePrompt(String datasetDescription, List<String> columnDescriptions) {

        final String BASE_PROMPT =
                "\nUsing the GenerateWidgetList function, generate UP TO 15 DISTINCT configuration options for graph " +
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
            log.warn(e.getMessage());
            return Optional.empty();
        }
    }



    public static List<Widget> processWidgetList(List<Widget> unprocessedWidgets) {

        final List<Widget> widgets = unprocessedWidgets.stream()
                .filter(widget -> widget.getTitle() != null && !widget.getTitle().isEmpty())
                .filter(widget -> widget.getGraphType() != null && Arrays.asList(GraphType.values()).contains(widget.getGraphType()))
                .filter(widget -> widget.getDescription() != null && !widget.getDescription().isEmpty())
                .filter(widget -> widget.getColumns() != null)
                .filter(widget -> {
                    boolean isMultiColumnGraph = List.of(GraphType.LINE_GRAPH, GraphType.BAR_GRAPH, GraphType.SCATTER_PLOT, GraphType.AREA_CHART).contains(widget.getGraphType()) && widget.getColumns().size() >= 2;
                    boolean isSingleColumnGraph = List.of(GraphType.STATISTICS_CARD).contains(widget.getGraphType()) && widget.getColumns().size() == 1;
                    return isMultiColumnGraph || isSingleColumnGraph;
                })
                .collect(Collectors.toList());

        /*
        // Assign each Widget a Unique Identifier
        widgets.forEach(widget -> {
            widget.setId(UUID.randomUUID().toString().substring(0, 8));
        });

        // Enable pinning for the first N random widgets
        Collections.shuffle(widgets);

        for (int i = 0; i < 6; i++) {
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


}
