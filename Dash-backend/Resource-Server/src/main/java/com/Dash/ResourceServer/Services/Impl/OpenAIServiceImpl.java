package com.Dash.ResourceServer.Services.Impl;

import com.Dash.ResourceServer.Models.RequestDTO;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.*;
import com.azure.core.credential.KeyCredential;
import lombok.extern.slf4j.Slf4j;

import com.Dash.ResourceServer.Models.Widget;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static com.Dash.ResourceServer.Utils.OpenAIUtils.*;


// FIXME -> SERVICE LAYER NOT API GATEWAY
@Slf4j
//@Service
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/gpt")
public class OpenAIServiceImpl { //implements OpenAIService {


    @Value("${openai.credentials.secret-key}")
    private String secretKey;

    @Value("${openai.model.version}")
    private String MODEL;


    // TODO TEMP
    @PostMapping()
    public List<Widget> foo(@RequestBody RequestDTO dataDTO) {
        // DTO -> dataset | desc | csv
        log.warn("HIT");
        String projectDescription;

        if (dataDTO.getDatasetDescription().isEmpty() || dataDTO.getDatasetDescription().isBlank())
            projectDescription = "\nMy dataset deals with air-quality data. It contains hourly readings of particulate matter concentrations in the city.";
        else
            projectDescription = dataDTO.getDatasetDescription();

        if (dataDTO.getColumnData() == null || dataDTO.getColumnData().isEmpty()) {
            // FIXME frontend must populate these strings for me this format
            List<String> cols = List.of(
                    "column-name: date, column-datatype: datetime object, description: hourly timestamps of when particulate matter readings were taken, category: TEMPORAL",
                    "column-name: temperature, column-datatype: double, description: temperature readings of environment, category: NUMERICAL",
                    "column-name: pm10, column-datatype: double, description: concentration of particulate matter of size 10 mm or smaller, category: NUMERICAL",
                    "column-name: pm25, column-datatype: double, description: concentration of particulate matter of size 2.5 mm or smaller, category: NUMERICAL",
                    "column-name: humidity, column-datatype: double, description: moistness of environment, measured by precipitation and other factors, category: NUMERICAL"
            );

            dataDTO.setColumnData(cols);
        }

        return generateWidgetConfigs(dataDTO).get();
    }



    public Optional<List<Widget>> generateWidgetConfigs(RequestDTO requestDTO) { // TODO
        OpenAIClient openAIClient = new OpenAIClientBuilder()
                .credential(new KeyCredential(secretKey))
                .buildClient();

        List<ChatRequestMessage> chatMessages = new ArrayList<>();

        // Add context via system message
        chatMessages.add(new ChatRequestSystemMessage("You are a helpful assistant that ONLY RETURNS JSON OBJECTS/STRINGS." +
                " This is to ensure that the responses can be easily parsed and used in applications. Please format your responses accordingly."
                + "ONLY RETURN JSON OBJECTS/STRINGS. DO NOT ADD COMMENTS OR ANNOTATIONS."));

        chatMessages.add(new ChatRequestSystemMessage(additionalSystemContext()));

        /*
        chatMessages.add(new ChatRequestSystemMessage("When crafting widgets, carefully select graph types and data operations that" +
                " match your dataset's column categories: NUMERICAL, TEMPORAL, CATEGORICAL, and IDENTIFIER. For 'LINE_GRAPH', ensure there's at" +
                " least one TEMPORAL and one NUMERICAL column to depict time-based changes or relationships. Avoid 'LINE_GRAPH' without TEMPORAL" +
                " data. 'BAR_GRAPH' requires 2 COLUMNS AT LEAST, 1 CATEGORICAL column for labels and a NUMERICAL column for values. " +
                "Lastly, avoid nonsensical widgets by " +
                " ensuring column types align with the graph's intended analysis, such as not using 'LINE_GRAPH' for non-temporal data." +
//                " You're provided with the actual data from the CSV, use this contextual data to inform your choice of the correct graph types." +
                " Always align your data with the graph type and operations for insightful visualizations. DO NOT GENERATE YOUR OWN GRAPH TYPES OR DATA OPERATIONS"));
        */

        chatMessages.add(new ChatRequestSystemMessage("When crafting widgets, focus on selecting graph types that match your dataset's column categories: NUMERICAL, TEMPORAL, CATEGORICAL, and IDENTIFIER. For 'LINE_GRAPH', it's essential to have at least one TEMPORAL and one NUMERICAL column to effectively depict time-based changes or relationships. Ensure you have TEMPORAL data when using 'LINE_GRAPH'. 'BAR_GRAPH' benefits from having at least 1 CATEGORICAL column for labels and a NUMERICAL column for values, suitable for comparing different categories. Always align your data carefully with the chosen graph type for the most insightful visualizations."));

        chatMessages.add(new ChatRequestUserMessage(generatePrompt(requestDTO.getDatasetDescription(), requestDTO.getColumnData())));


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
            } else {
                log.warn(followUpChoice.getFinishReason().toString());
            }
        }

        return Optional.empty();
    }

}
