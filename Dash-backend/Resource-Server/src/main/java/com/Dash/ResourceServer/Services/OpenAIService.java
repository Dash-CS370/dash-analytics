package com.Dash.ResourceServer.Services;

import com.Dash.ResourceServer.Models.Widget;

import java.util.List;
import java.util.Optional;


public interface OpenAIService {

    Optional<List<Widget>> attemptWidgetGenerationWithRetry(String description, List<String> columnDescriptions, int retryCount);

    Optional<List<Widget>> generateWidgetConfigs(String description, List<String> columnDescriptions) throws RuntimeException;

}
