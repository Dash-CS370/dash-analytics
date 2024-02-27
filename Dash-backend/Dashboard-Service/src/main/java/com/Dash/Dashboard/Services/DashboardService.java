package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Models.Project;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction.oauth2AuthorizedClient;



@Service
@Slf4j
public class DashboardService {

    private final static String S3URL = "s3://dash-analytics-test/";

    private final WebClient webClient;

    @Autowired
    DashboardService(WebClient webClient) {
        this.webClient = webClient;
    }


    /**
     * @param client
     * @param userId
     * @return
     * @throws WebClientResponseException
     */
    public Optional<List<Project>> loadAllProjects(OAuth2AuthorizedClient client, String userId) throws WebClientResponseException {

        userId = "user123@gmail.com"; //TODO DUMMY USER

        // Encode url with username
        final String resourceUrl = UriComponentsBuilder.fromUriString("http://127.0.0.1:8081/resources/api/all-projects/{userId}")
                    .buildAndExpand(userId).toUriString();

        // Hit Resource Server
        final List<Project> userProjects = this.webClient.get().uri(resourceUrl)
                                        .attributes(oauth2AuthorizedClient(client))
                                        .retrieve()
                                        .bodyToMono(new ParameterizedTypeReference<List<Project>>() {})
                                        .block();

        return Optional.ofNullable(userProjects);
    }




    /**
     * @param projectName
     * @param projectDescription
     * @param csvFile
     * @return
     * @throws WebClientException
     * @throws IOException
     */
    public Optional<Project> createProject(String projectName, String projectDescription, MultipartFile csvFile//,
                                          /*OAuth2AuthorizedClient client*/) throws WebClientResponseException, IOException {

        final String userId = "user123@gmail.com"; //client.getPrincipalName();

        // Check if User has enough credits to create new project
        if (!userHasEnoughCredits(userId)) {
            return Optional.empty();
        }

        final String projectId = UUID.randomUUID().toString();

        final String projectKey = userId.concat("/").concat("project-").concat(projectId);

        final Project templateProject = Project.builder().projectId(projectId).projectName(projectName)
            .csvSheetLink(projectKey.concat("/").concat(projectId.concat(".csv")))
            .projectDescription(projectDescription).widgets(new ArrayList<>()).build();


        final String createProjectUrl = UriComponentsBuilder.fromUriString("http://127.0.0.1:8081/resources/api/generate-project")
                .buildAndExpand(userId).toUriString();


        // Make HTTP request to upload CSV sheet + create Project JSON (create project folder + project json file)
        return this.webClient.post()
                .uri(createProjectUrl)
                .body(BodyInserters.fromMultipartData("template-project", templateProject).
                with("csv-data", csvFile.getBytes()))
                //.attributes(oauth2AuthorizedClient(client))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Optional<Project>>() {})
                .block();
    }




    // TODO - add Token attribute to User Entity
    public boolean userHasEnoughCredits(String userId) {
        return userId.length() > 0;
    }

    public static boolean isPresent(Object obj) {
        return obj != null;
    }

}
