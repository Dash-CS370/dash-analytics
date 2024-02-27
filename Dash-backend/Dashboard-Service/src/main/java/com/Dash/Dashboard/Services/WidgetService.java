package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Models.Widget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class WidgetService {

    // TODO -> Use WebFlux to make async calls to resource server

    private final static String S3URL = "s3://dash-analytics-test/";

    private final WebClient webClient;

    @Autowired
    WidgetService(WebClient webClient) {
        this.webClient = webClient;
    }


    // TODO
    public Optional<Object> addWidget(//OAuth2AuthorizedClient client
                                      final String projectLink, Widget widget) {

        final String userId = "user123@gmail.com"; //client.getPrincipalName();

        final String createProjectUrl = UriComponentsBuilder.fromUriString("http://127.0.0.1:8081/resources/api/add-widget").
                buildAndExpand(userId).toUriString();

        Mono<Object> responseObject = this.webClient.post()
                .uri(createProjectUrl)
                .body(BodyInserters.fromMultipartData("widget", widget).with("project-link", projectLink))
                //.attributes(oauth2AuthorizedClient(client))
                .retrieve()
                .bodyToMono(Object.class);

        //responseObject.subscribe(() -> {});

        return Optional.empty();
    }


}
