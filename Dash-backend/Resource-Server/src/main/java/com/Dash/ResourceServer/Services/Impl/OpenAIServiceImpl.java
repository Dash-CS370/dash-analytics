package com.Dash.ResourceServer.Services.Impl;

import com.Dash.ResourceServer.Models.DataOperations;
import com.Dash.ResourceServer.Models.FunctionProperties.WidgetProperty;
import com.Dash.ResourceServer.Models.GraphType;
import com.Dash.ResourceServer.Services.OpenAIService;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import com.azure.core.util.BinaryData;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import com.Dash.ResourceServer.Models.Widget;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
public class OpenAIServiceImpl implements OpenAIService {


    @Value("${openai.model.version}")
    private String MODEL;

    private final OpenAIClient openAIClient;

    @Autowired
    OpenAIServiceImpl(OpenAIClient openAIClient) {
        this.openAIClient = openAIClient;
    }


    @PreAuthorize("permitAll()")
    @GetMapping
    public Optional<List<Widget>> generateWidgetConfigs() throws RuntimeException { // TODO

        List<ChatRequestMessage> chatMessages = new ArrayList<>();

        // Add context via system message
        chatMessages.add(new ChatRequestSystemMessage("You are a helpful assistant that ONLY RETURNS JSON OBJECTS/STRINGS."));

        // Ask/Request actual command FIXME
        chatMessages.add(new ChatRequestUserMessage(generatePrompt("user's project description", List.of("column descriptions"))));


        // Tool/FunctionCall definition with function alias
        ChatCompletionsToolDefinition toolDefinition = new ChatCompletionsFunctionToolDefinition(getWidgetsGenerationFunctionDefinition());


        // As part of the chat completion/response, set the tools attribute
        ChatCompletionsOptions chatCompletionsOptions = new ChatCompletionsOptions(chatMessages);
        chatCompletionsOptions.setTools(List.of(toolDefinition));

        // Instantiate the Chat Completion object with the model for gpt and the chat completions options
        ChatCompletions chatCompletions = this.openAIClient.getChatCompletions(MODEL, chatCompletionsOptions);

        ChatChoice choice = chatCompletions.getChoices().get(0);

        // THE LLM will now request the calling of the function we defined in the original request
        if (choice.getFinishReason() == CompletionsFinishReason.TOOL_CALLS) {

            ChatRequestAssistantMessage assistantMessage = new ChatRequestAssistantMessage("");
            assistantMessage.setToolCalls(choice.getMessage().getToolCalls());

            List<ChatRequestMessage> followUpMessages = new ArrayList<>();
            followUpMessages.add(chatMessages.get(0)); // System message
            followUpMessages.add(chatMessages.get(1)); // User message
            followUpMessages.add(assistantMessage);

            for (ChatCompletionsToolCall toolCall : choice.getMessage().getToolCalls()) {
                ChatCompletionsFunctionToolCall prepToolCall = (ChatCompletionsFunctionToolCall) toolCall;
                String toolCallResponseData = widgetSchema();
                ChatRequestToolMessage toolResponseMessage = new ChatRequestToolMessage(toolCallResponseData, prepToolCall.getId());
                followUpMessages.add(toolResponseMessage);
            }

            ChatCompletionsOptions followUpChatCompletionsOptions = new ChatCompletionsOptions(followUpMessages);
            ChatCompletions followUpChatCompletions = this.openAIClient.getChatCompletions(MODEL, followUpChatCompletionsOptions);

            if (followUpChatCompletions.getChoices().isEmpty()) {
                throw new RuntimeException("Request for follow up Chat failed...");
            }

            ChatChoice followUpChoice = followUpChatCompletions.getChoices().get(0);

            if (followUpChoice.getFinishReason() == CompletionsFinishReason.STOPPED) {
                log.warn("\n" + followUpChoice.getMessage().getContent());
                return extractWidgets(followUpChoice.getMessage().getContent());
            }
        }

        return Optional.empty();
    }



    private static String widgetSchema() {
        return "{"
                + "  \"type\": \"array\","
                + "  \"properties\": ["
                + "    {"
                + "      \"title\": \"Sample Widget Title\","
                + "      \"graph_type\": \"LINE_GRAPH\","
                + "      \"data_operations\": [\"DROP_NAN_ROWS\", \"AVERAGE_N_ROWS\"],"
                + "      \"required_columns\": [\"column1\", \"column2\"]"
                + "    }"
                + "  ]"
                + "}";
    }

    private static FunctionDefinition getWidgetsGenerationFunctionDefinition() {
        FunctionDefinition functionDefinition = new FunctionDefinition("GenerateWidgetList");
        functionDefinition.setDescription("Returns JSON object representing widgets with these EXACT 4 fields: title, graph_type, data_operations, & required_columns");
        WidgetListParameters parameters = new WidgetListParameters();
        functionDefinition.setParameters(BinaryData.fromObject(parameters));
        return functionDefinition;
    }

    private static class WidgetListParameters {
        @JsonProperty("type")
        private String type = "object";

        @JsonProperty("properties")
        private WidgetProperty widgetProperty = new WidgetProperty();
    }


    // FIXME
    public String generatePrompt(String projectDescription, List<String> columnDescriptions) {

        final String BASE_PROMPT = "\n\nUsing the GenerateWidgetList function, generate 15 DIVERSE configuration options for graph widgets based on the following dataset description (ONLY RETURN A JSON OBJECT CALLED \"widgets\"): ";

        projectDescription = "\nMy dataset deals with air-quality data. It contains hourly readings of particulate matter concentrations in the city.";

        String prompt = BASE_PROMPT + projectDescription;

        columnDescriptions =
            List.of( // TODO frontend-populate these strings in this format for me
                "column-name: date, column-datatype: datetime, description: hourly timestamps of when particulate matter readings were taken",
                "column-name: temperature, column-datatype: double, description: temperature readings of environment",
                "column-name: pm10, column-datatype: double, description: concentration of particulate matter of size 10 mm or smaller",
                "column-name: pm25, column-datatype: double, description: concentration of particulate matter of size 2.5 mm or smaller"
            );

        prompt = prompt.concat("\n\nThe following is information on each column:");

        // Add column descriptions
        for (String columnDescription : columnDescriptions) {
            prompt = prompt.concat("\n" + columnDescription);
        }

        prompt = prompt.concat("\n\nEach configuration option should ALWAYS include a title, graph type, data operations, and columns. The title should be a string that is concise and accurately describes the graph.\n");
        prompt = prompt.concat("The graph type should be a string chosen from the following options (the graphType string must match spelling and case)."); //Note that each option has a name, followed by a description and the required columns to create the graph (the graphType string must match spelling and case):\n");

        for (GraphType graphType : GraphType.values()) {
            prompt = prompt.concat(graphType + ", ");
        }

        prompt = prompt.concat("\n\nThe data operations should be a list of strings that represent operations to perform on the data. These operations will manipulate the data to calculate more useful metrics to be graphed. The operations should be chosen from the following options (the string must match spelling and case):\n");

        for (DataOperations dataOperation : DataOperations.values()) {
            prompt = prompt.concat(dataOperation + ", ");
        }

        return prompt;
    }



    // TODO
    public Optional<List<Widget>> extractWidgets(String response) {

        if (!response.startsWith("{")) {
            response = response.substring(response.indexOf("{"), response.lastIndexOf("}") + 1).strip();
            log.warn("CLEANED RESPONSE: \n" + response);
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            return Optional.ofNullable(
                    objectMapper.readValue(objectMapper.readTree(response).get("widgets").toString(), new TypeReference<List<Widget>>() {})
            );

        } catch (JsonProcessingException e) {
            log.warn(e.getMessage());
            return Optional.empty();
        }
    }



}
