package com.Dash.ResourceServer.Services.Impl;

import com.Dash.ResourceServer.Models.FunctionProperties.WidgetProperty;
import com.Dash.ResourceServer.Services.OpenAIService;
import com.Dash.ResourceServer.Utils.OpenAIUtils;
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
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.Dash.ResourceServer.Utils.OpenAIUtils.extractWidgets;
import static com.Dash.ResourceServer.Utils.OpenAIUtils.generatePrompt;



// FIXME -> SERVICE LAYER NOT API GATEWAY
@Slf4j
//@Service
@RestController
@RequestMapping("/api/gpt")
public class OpenAIServiceImpl implements OpenAIService {


    @Value("${openai.model.version}")
    private String MODEL;

    private final OpenAIClient openAIClient;

    private final OpenAIUtils openAIUtils;

    @Autowired
    OpenAIServiceImpl(OpenAIClient openAIClient, OpenAIUtils openAIUtils) {
        this.openAIUtils = openAIUtils;
        this.openAIClient = openAIClient;
    }


    //@PreAuthorize("permitAll()")
    @GetMapping
    // args: String projectDescription, List<String> columnDescriptions
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

            // TODO --> Should we have multiple options/choices?
            ChatChoice followUpChoice = followUpChatCompletions.getChoices().get(0);

            if (followUpChoice.getFinishReason() == CompletionsFinishReason.STOPPED) {
                log.warn("\n" + followUpChoice.getMessage().getContent().strip());
                return extractWidgets(followUpChoice.getMessage().getContent().strip());
            }
        }

        return Optional.empty();
    }


    private static String widgetSchema() {
        return  "{"
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
        // FIXME?
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

}
