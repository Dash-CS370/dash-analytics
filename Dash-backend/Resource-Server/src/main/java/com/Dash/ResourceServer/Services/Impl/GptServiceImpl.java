package com.Dash.ResourceServer.Services.Impl;

import com.Dash.ResourceServer.Models.Widget;
import com.Dash.ResourceServer.Services.GptService;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.*;
import com.azure.core.credential.KeyCredential;
import com.azure.core.exception.HttpResponseException;
import io.netty.handler.timeout.TimeoutException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.Dash.ResourceServer.Utils.OpenAIUtils.*;


@Slf4j
@Service
public class GptServiceImpl implements GptService {

    @Value("${openai.credentials.secret-key}")
    private String secretKey;

    @Value("${openai.model.version}")
    private String MODEL;

    public Optional<List<Widget>> generateWidgetConfigs(String datasetDescription, List<String> columnDescriptions) {

        final OpenAIClient openAIClient = new OpenAIClientBuilder().credential(new KeyCredential(secretKey)).buildClient();

        List<ChatRequestMessage> chatMessages = new ArrayList<>();

        // Add context via system message
        chatMessages.add(new ChatRequestSystemMessage("You are a helpful assistant that ONLY RETURNS JSON OBJECTS/STRINGS."
                + "This is to ensure that the responses can be easily parsed and used in applications. Please format your responses accordingly."
                + "ONLY RETURN JSON OBJECTS/STRINGS. DO NOT ADD COMMENTS OR ANNOTATIONS."));

        chatMessages.add(new ChatRequestSystemMessage(additionalSystemContext()));

        chatMessages.add(new ChatRequestSystemMessage("When crafting widgets, carefully select graph types and data operations that" +
                " match your dataset's column categories: NUMERICAL, TEMPORAL, CATEGORICAL, and IDENTIFIER. For 'LINE_GRAPH', ensure there's at" +
                " least one TEMPORAL and ONE OR MORE NUMERICAL columns to depict time-based changes or relationships. Avoid using 'LINE_GRAPH' without TEMPORAL" +
                " data. 'BAR_GRAPH' REQUIRES 2 COLUMNS AT LEAST, 1 (AND ONLY 1) CATEGORICAL column for labels AND AT LEAST 1 or MORE NUMERICAL column for values. Avoid using 'BAR_GRAPH' WITHOUT CATEGORICAL data." +
                " Lastly, avoid nonsensical widgets by ensuring column types align with the graph's intended analysis, such as not using 'LINE_GRAPH' for non-temporal data." +
                " Always align your data with the graph type and operations for insightful visualizations. DO NOT GENERATE YOUR OWN GRAPH TYPES OR DATA OPERATIONS AND" +
                " ONLY ADD GRAPHS THAT MAKE SENSE GIVEN THE USER CONTEXT, IT IS BETTER TO HAVE FEWER GRAPHS THAN GRAPHS THAT AREN'T USEFUL."));

        chatMessages.add(new ChatRequestUserMessage(generatePrompt(datasetDescription, columnDescriptions)));


        // Tool/FunctionCall definition with function alias
        ChatCompletionsToolDefinition toolDefinition = new ChatCompletionsFunctionToolDefinition(new FunctionDefinition("GenerateWidgetList"));

        // As part of the chat completion/response, set the tools attribute
        ChatCompletionsOptions chatCompletionsOptions = new ChatCompletionsOptions(chatMessages);
        chatCompletionsOptions.setTools(List.of(toolDefinition));

        // Instantiate the Chat Completion object with the model for gpt and the chat completions options
        ChatCompletions chatCompletions = openAIClient.getChatCompletions(MODEL, chatCompletionsOptions);

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
            ChatCompletions followUpChatCompletions = openAIClient.getChatCompletions("gpt-4", followUpChatCompletionsOptions);

            if (followUpChatCompletions.getChoices().isEmpty()) {
                throw new RuntimeException("Request for follow up Chat failed...");
            }

            ChatChoice followUpChoice = followUpChatCompletions.getChoices().get(0);

            if (followUpChoice.getFinishReason() == CompletionsFinishReason.STOPPED) {
                log.warn("\n" + followUpChoice.getMessage().getContent().strip());
                return extractWidgets(followUpChoice.getMessage().getContent().strip());
            }
        }

        return Optional.empty();
    }




    public Optional<List<Widget>> attemptWidgetGenerationWithRetry(String datasetDescription, List<String> columnDescriptions, int retryCount) throws InterruptedException {
        try {
            return generateWidgetConfigs(datasetDescription, columnDescriptions);
        }
        catch (TimeoutException | HttpResponseException e) {
            log.warn("Connection Error : " + e.getMessage());

            if (retryCount > 0) {

                Thread.sleep(1000 * 10);
                log.warn("Attempting to re-establish connection with OpenAI Client...");

                return attemptWidgetGenerationWithRetry(datasetDescription, columnDescriptions, retryCount - 1);
            } else {
                log.error("Retries exhausted. Failing operation...");
                return Optional.empty();
            }
        } catch (Exception e) {
            log.warn("General Error : " + e.getMessage());
            return Optional.empty();
        }
    }


}
