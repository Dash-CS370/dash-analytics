package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Event.Listener.UserCreditCheckEventListener;
import com.Dash.Dashboard.Event.UserCreditCheckEvent;
import com.Dash.Dashboard.Exceptions.NotEnoughCreditsException;
import com.Dash.Dashboard.Models.Project;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
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

    private final UserCreditCheckEventListener userCreditCheckEventListener;

    private final WebClient webClient;

    @Autowired
    DashboardService(WebClient webClient, UserCreditCheckEventListener userCreditCheckEventListener) {
        this.webClient = webClient;
        this.userCreditCheckEventListener = userCreditCheckEventListener;
    }


    /**
     * @param client
     * @param userId
     * @return
     * @throws WebClientResponseException
     */
    public Optional<List<Project>> loadAllProjects(OAuth2AuthorizedClient client, String userId) throws WebClientResponseException {

        //TODO DUMMY USER
        userId = "user123@gmail.com";

        // Encode url with username
        final String resourceUrl = UriComponentsBuilder.fromUriString("http://127.0.0.1:8081/resources/api/all-projects/{userId}")
                    .buildAndExpand(userId).toUriString();

        // Hit Resource Server
        final List<Project> userProjects = this.webClient.get().uri(resourceUrl)
                                        //.attributes(oauth2AuthorizedClient(client))
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
    public Optional<Project> createProject(OAuth2AuthorizedClient client, String projectName,
                                           String projectDescription, MultipartFile csvFile) throws WebClientResponseException {

        String userId = "user789@gmail.com"; //oidcUser.getPrincipalName(); // TODO --> get user email

        final String projectId = UUID.randomUUID().toString();

        final String projectKey = userId.concat("/").concat("project-").concat(projectId);

        final Project templateProject = Project.builder().projectId(projectId).projectName(projectName)
            .csvSheetLink(projectKey.concat("/").concat(projectId.concat(".csv")))
            .projectDescription(projectDescription).widgets(new ArrayList<>()).build();


        final String createProjectUrl = UriComponentsBuilder.fromUriString("http://127.0.0.1:8081/resources/api/generate-project")
                .toUriString();

        MultipartBodyBuilder csvBuilder = new MultipartBodyBuilder();
        csvBuilder.part("csv-file", csvFile.getResource());

        // Make HTTP request to upload CSV sheet + create Project JSON (create project folder + project json file)
        return this.webClient.post()
                .uri(createProjectUrl)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(csvBuilder.build())
                .with("template-project", templateProject))
                //.attributes(oauth2AuthorizedClient(client))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Optional<Project>>() {})
                .block();
    }




    /**
     *
     * @param client
     * @param projectKey
     * @return
     * @throws WebClientResponseException
     */
    public Optional<String> deleteProject(OAuth2AuthorizedClient client, String projectKey) throws WebClientResponseException {

        final String deleteProjectUrl = UriComponentsBuilder
                .fromUriString("http://127.0.0.1:8081/resources/api/delete-project")
                .path("/{project-key}")
                .encode()
                .buildAndExpand(projectKey).toUriString();

        return this.webClient.delete()
                .uri(deleteProjectUrl)
                //.attributes(oauth2AuthorizedClient(client))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Optional<String>>() {})
                .block();
    }





    // TODO - add Token attribute to User Entity
    public void verifyUserCreditCount(String userId) throws NotEnoughCreditsException {
        userCreditCheckEventListener.onApplicationEvent(new UserCreditCheckEvent(userId));
    }

    public static boolean isPresent(Object obj) {
        return obj != null;
    }

}
