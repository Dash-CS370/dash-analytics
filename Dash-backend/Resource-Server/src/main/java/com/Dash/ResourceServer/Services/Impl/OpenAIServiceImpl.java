package com.Dash.ResourceServer.Services.Impl;

import com.Dash.ResourceServer.Services.OpenAIService;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import lombok.extern.slf4j.Slf4j;

import com.Dash.ResourceServer.Models.Widget;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.Dash.ResourceServer.Utils.OpenAIUtils.*;


// FIXME -> SERVICE LAYER NOT API GATEWAY
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


    // TODO TEMP
    @GetMapping
    public void foo() {
        String projectDescription = "\nMy dataset deals with air-quality data. It contains hourly readings of particulate matter concentrations in the city.";
        // FIXME frontend must populate these strings for me this format
        List<String> columnDescriptions = List.of(
                        "column-name: date, column-datatype: datetime object, description: hourly timestamps of when particulate matter readings were taken",
                        "column-name: temperature, column-datatype: double, description: temperature readings of environment",
                        "column-name: pm10, column-datatype: double, description: concentration of particulate matter of size 10 mm or smaller",
                        "column-name: pm25, column-datatype: double, description: concentration of particulate matter of size 2.5 mm or smaller",
                        "column-name: humidity, column-datatype: double, description: moistness of environment, measured by precipitation and other factors"
                );

        generateWidgetConfigs(projectDescription, columnDescriptions);
    }



    //@PreAuthorize("permitAll()")
    public Optional<List<Widget>> generateWidgetConfigs(String projectDescription, List<String> columnDescriptions) throws RuntimeException { // TODO

        List<ChatRequestMessage> chatMessages = new ArrayList<>();

        // Add context via system message
        chatMessages.add(new ChatRequestSystemMessage("You are a helpful assistant that ONLY RETURNS JSON OBJECTS/STRINGS." +
                " This is to ensure that the responses can be easily parsed and used in applications. Please format your responses accordingly."));

        chatMessages.add(new ChatRequestSystemMessage("Using the GenerateWidgetList function, generate 15 DIFFERENT configuration options for graph " +
                            "widgets based SOLELY on the User's dataset description and column descriptions"));

        chatMessages.add(new ChatRequestSystemMessage(additionalSystemContext()));

        chatMessages.add(new ChatRequestUserMessage(generatePrompt(projectDescription, columnDescriptions)));


        // Tool/FunctionCall definition with function alias
        ChatCompletionsToolDefinition toolDefinition = new ChatCompletionsFunctionToolDefinition(
                new FunctionDefinition("GenerateWidgetList"));


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

            List<ChatRequestMessage> followUpMessages = new ArrayList<>(chatMessages);
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
                log.warn("\n" + followUpChoice.getMessage().getContent().strip());
                return extractWidgets(followUpChoice.getMessage().getContent().strip());
            } else {
                log.warn(followUpChoice.getFinishReason().toString());
            }
        }

        return Optional.empty();
    }



}
