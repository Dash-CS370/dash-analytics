package com.Dash.ResourceServer.Services;

import com.Dash.ResourceServer.Models.DataOperations;
import com.Dash.ResourceServer.Models.GraphType;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import lombok.extern.slf4j.Slf4j;

import com.Dash.ResourceServer.Models.Widget;
import com.Dash.ResourceServer.Models.Project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


// FIXME -> SERVICE LAYER NOT REST GATEWAY
@Slf4j
//@Service
@RestController
@RequestMapping("/api/gpt")
public class OpenAPIService {

    private static final String BASE_PROMPT = "\nUsing the GenerateWidgetList function, generate 10 to 20 configuration options for graph widgets based on the following dataset description: ";

    private static final String MODEL = "gpt-3.5-turbo";

    private final OpenAIClient openAIClient;

    @Autowired
    OpenAPIService(OpenAIClient openAIClient) {
        this.openAIClient = openAIClient;
    }


    @PreAuthorize("permitAll()")
    @GetMapping
    public String test() throws Exception { // TODO

        String configResponse = null;

        List<ChatRequestMessage> chatMessages = new ArrayList<>();

        // Add context via system message
        chatMessages.add(new ChatRequestSystemMessage("You are a helpful assistant."));

        // Ask/Request actual command
        chatMessages.add(new ChatRequestUserMessage(generatePrompt("projectDescription", List.of("columnDescriptions"))));


        // Tool/FunctionCall definition with function alias
        ChatCompletionsToolDefinition toolDefinition = new ChatCompletionsFunctionToolDefinition(
                new FunctionDefinition("GenerateWidgetList")
        );

        // As part of the chat completion/response, set the tools attribute
        ChatCompletionsOptions chatCompletionsOptions = new ChatCompletionsOptions(chatMessages);
        chatCompletionsOptions.setTools(List.of(toolDefinition));

        // Instantiate the Chat Completion object with the model for gpt and the chat completions options
        ChatCompletions chatCompletions = this.openAIClient.getChatCompletions(MODEL, chatCompletionsOptions);

        ChatChoice choice = chatCompletions.getChoices().get(0);

        // THE LLM will now request the calling of the function we defined in the original request
        if (choice.getFinishReason() == CompletionsFinishReason.TOOL_CALLS) {

            ChatCompletionsFunctionToolCall toolCall = (ChatCompletionsFunctionToolCall) choice.getMessage().getToolCalls().get(0);

            final String functionCallResultSchema = widgetSchema();

            ChatRequestAssistantMessage assistantMessage = new ChatRequestAssistantMessage("");
            assistantMessage.setToolCalls(choice.getMessage().getToolCalls());

            // We include:
            // - The past 2 messages from the original request
            // - A new ChatRequestAssistantMessage with the tool calls from the original request
            // - A new ChatRequestToolMessage with the result of our function call
            List<ChatRequestMessage> followUpMessages = List.of(
                    chatMessages.get(0),
                    chatMessages.get(1),
                    assistantMessage,
                    new ChatRequestToolMessage(functionCallResultSchema, toolCall.getId())
            );

            ChatCompletionsOptions followUpChatCompletionsOptions = new ChatCompletionsOptions(followUpMessages);

            ChatCompletions followUpChatCompletions = this.openAIClient.getChatCompletions(MODEL, followUpChatCompletionsOptions);

            if (followUpChatCompletions.getChoices().isEmpty()) {
                log.error("Follow up failed...");
                throw new Exception("OOPS"); //FIXME
            }

            log.warn("Follow up received");

            ChatChoice followUpChoice = followUpChatCompletions.getChoices().get(0);

            // TODO -> Serialize into List of Widgets **********************
            if (followUpChoice.getFinishReason() == CompletionsFinishReason.STOPPED) {
                log.warn("Chat Completions Result: " + followUpChoice.getMessage().getContent());
                configResponse = followUpChoice.getMessage().getContent();
            }

        }

        return configResponse;
    }



    private static String widgetSchema() {
        return "{"
                + "\"type\": \"object\","
                + "\"properties\": {"
                + "  \"type\": {"
                + "    \"type\": \"string\","
                + "    \"description\": \"Indicates the structure type, which is an array for a list of widgets.\""
                + "  },"
                + "  \"widget-count\": {"
                + "    \"type\": \"integer\","
                + "    \"description\": \"The number of widgets to be generated or included in the list.\""
                + "  },"
                + "  \"widget-configs\": {"
                + "    \"type\": \"array\","
                + "    \"description\": \"An array of widget configurations, each with its own set of properties.\","
                + "    \"items\": {"
                + "      \"type\": \"object\","
                + "      \"properties\": {"
                + "        \"title\": {"
                + "          \"type\": \"object\","
                + "          \"properties\": {"
                + "            \"type\": { \"type\": \"string\", \"description\": \"Indicates the data type of the title, which is a string.\" },"
                + "            \"description\": { \"type\": \"string\", \"description\": \"A brief description of what the title represents.\" }"
                + "          }"
                + "        },"
                + "        \"graph-type\": {"
                + "          \"type\": \"object\","
                + "          \"properties\": {"
                + "            \"type\": { \"type\": \"string\", \"description\": \"Indicates the data type of the graph type, which is a string.\" },"
                + "            \"description\": { \"type\": \"string\", \"description\": \"A brief description of what the graph type represents.\" }"
                + "          }"
                + "        },"
                + "        \"data-operations\": {"
                + "          \"type\": \"object\","
                + "          \"properties\": {"
                + "            \"type\": { \"type\": \"string\", \"description\": \"Indicates the data type for data operations, which is an array of strings.\" },"
                + "            \"description\": { \"type\": \"string\", \"description\": \"A list of operations to perform on the data.\" }"
                + "          }"
                + "        },"
                + "        \"required-columns\": {"
                + "          \"type\": \"object\","
                + "          \"properties\": {"
                + "            \"type\": { \"type\": \"string\", \"description\": \"Indicates the data type for required columns, which is an array of strings.\" },"
                + "            \"description\": { \"type\": \"string\", \"description\": \"A list of required column names for the widget data.\" }"
                + "          }"
                + "        }"
                + "      }"
                + "    }"
                + "  }"
                + "}";
    }



    private static String generatePrompt(String projectDescription, List<String> columnDescriptions) {

        projectDescription = "\nMy dataset deals with air-quality data. It contains hourly readings of particulate matter concentrations in the city.";

        String prompt = BASE_PROMPT + projectDescription;

        columnDescriptions =
            List.of(
                "column-name: date, column-datatype: datetime, description: hourly timestamps of when particulate matter readings were taken",
                "column-name: pm10, column-datatype: double, description: concentration of particulate matter of size 10 mm or smaller",
                "column-name: pm25, column-datatype: double, description: concentration of particulate matter of size 2.5 mm or smaller"
            );

        prompt = prompt.concat("\n\nThe following is information on each column:");

        // Add column descriptions
        for (String columnDescription : columnDescriptions) {
            prompt = prompt.concat("\n" + columnDescription);
        }

        prompt = prompt.concat("\n\nEach configuration option should include a title, graph type, data operations, and columns. The title should be a string that is consice and accurately describes the graph.\n");
        prompt = prompt.concat("The graph type should be a string chosen from the following options. Note that each option has a name, followed by a description and the required columns to create the graph (the graphType string must match spelling and case):\n");

        for (GraphType graphType : GraphType.values()) {
            prompt = prompt.concat(graphType + ", ");
        }

        prompt = prompt.concat("\nThe data operations should be a list of strings that represent operations to perform on the data. These operations will manipulate the data to calculate more useful metrics to be graphed. The operations should be chosen from the following options (the string must match spelling and case):\n");

        for (DataOperations dataOperation : DataOperations.values()) {
            prompt = prompt.concat(dataOperation + ", ");
        }

        log.warn(prompt);
        return prompt;
    }





    // TODO
    public Optional<Project> promptGptWith(Project templateProject) {
        templateProject.setWidgets(
                List.of(
                        new Widget("Graph 1",
                                GraphType.BAR_GRAPH,
                                List.of(DataOperations.AVERAGE_N_ROWS, DataOperations.DROP_NAN_ROWS),
                                List.of("Column 1", "Column 2", "Column 3")),

                        new Widget("Graph 2",
                                GraphType.LINE_CHART,
                                List.of(DataOperations.AVERAGE_N_ROWS, DataOperations.SLICE),
                                List.of("Column 4", "Column 5", "Column 6"))
                ));

        return Optional.of(templateProject);
    }




}
