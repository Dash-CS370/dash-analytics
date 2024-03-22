package com.Dash.ResourceServer.Config;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.KeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class OpenAIConfig {

    @Value("${openai.credentials.secret-key}")
    private String secretKey;

    @Bean
    public OpenAIClient openAIClientBuilder() {
        return new OpenAIClientBuilder()
                .credential(new KeyCredential(secretKey))
                .buildClient();
    }

}
