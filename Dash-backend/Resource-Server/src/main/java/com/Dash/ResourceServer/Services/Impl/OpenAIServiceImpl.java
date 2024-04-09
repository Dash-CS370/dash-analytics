package com.Dash.ResourceServer.Services.Impl;

import com.Dash.ResourceServer.Services.OpenAIService;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import lombok.extern.slf4j.Slf4j;

import com.Dash.ResourceServer.Models.Widget;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping("/{desc}")
    public List<Widget> foo(@PathVariable String desc, @RequestBody List<String> columnDescriptions) {

        String projectDescription;

        if (desc.isEmpty() || desc.isBlank())
            projectDescription = "\nMy dataset deals with air-quality data. It contains hourly readings of particulate matter concentrations in the city.";
        else
            projectDescription = desc;

        if (columnDescriptions.isEmpty()) {
            // FIXME frontend must populate these strings for me this format
            columnDescriptions = List.of(
                    "column-name: date, column-datatype: datetime object, description: hourly timestamps of when particulate matter readings were taken, category: TEMPORAL",
                    "column-name: temperature, column-datatype: double, description: temperature readings of environment, category: NUMERICAL",
                    "column-name: pm10, column-datatype: double, description: concentration of particulate matter of size 10 mm or smaller, category: NUMERICAL",
                    "column-name: pm25, column-datatype: double, description: concentration of particulate matter of size 2.5 mm or smaller, category: NUMERICAL",
                    "column-name: humidity, column-datatype: double, description: moistness of environment, measured by precipitation and other factors, category: NUMERICAL"
            );
        }

        return generateWidgetConfigs(projectDescription, columnDescriptions).get();
    }



    //@PreAuthorize("permitAll()")
    public Optional<List<Widget>> generateWidgetConfigs(String projectDescription, List<String> columnDescriptions) throws RuntimeException { // TODO

        List<ChatRequestMessage> chatMessages = new ArrayList<>();

        // Add context via system message
        chatMessages.add(new ChatRequestSystemMessage("You are a helpful assistant that ONLY RETURNS JSON OBJECTS/STRINGS." +
                " This is to ensure that the responses can be easily parsed and used in applications. Please format your responses accordingly."));

        chatMessages.add(new ChatRequestSystemMessage("When selecting a graph type and applying data operations, it's essential to first verify the number and type of columns required to ensure the selected graph type is appropriate for your data. " +
                "For instance, 'LINE_GRAPH' widgets require two or more columns to effectively depict changes over time or the relationships between variables, making it imperative that at least one of these columns provides a temporal (time-based) dimension to track these changes accurately. " +
                "This requirement guarantees that each line graph can represent a distinct set of data, offering clear insights into how each series evolves over time. " +
                "Graph types and the number of available columns must align; not all graph types or data operations will be suitable for every dataset, as the compatibility of column types varies." +
                "Specifically, IF NONE OF THE PROVIDED COLUMNS ARE OF THE CATEGORY TEMPORAL, NEVER USE 'LINE_GRAPH' or any graph types designed primarily for time series analysis. Categories of data include NUMERICAL, TEMPORAL, CATEGORICAL, and IDENTIFIER, " +
                "and each plays a crucial role in determining the most appropriate graph type. Furthermore, creating widgets that do not logically align with the data type can lead to nonsensical visualizations. For example, applying 'LOGARITHMIC_SCALING' to a 'weight' column and visualizing it with a 'LINE_GRAPH' is not practical without a clear temporal axis." +
                "Similarly, generating a 'HISTOGRAM' of 'patient_id' values may not provide meaningful insight, as 'patient_id' typically serves as an identifier rather than a numerical variable for distribution analysis." +
                "Always match your data with the graph type and operations that will best highlight the underlying patterns and insights, ensuring the visualization is both logical and informative."));

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
            log.warn(followUpMessages.size() + "");

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
