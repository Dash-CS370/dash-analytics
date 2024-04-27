package com.Dash.Dashboard.Services.Impl;

import com.Dash.Dashboard.Events.Listener.UserCreditCheckEventListener;
import com.Dash.Dashboard.Events.UserCreditCheckEvent;
import com.Dash.Dashboard.Exceptions.NotEnoughCreditsException;
import com.Dash.Dashboard.Models.Project;
import com.Dash.Dashboard.OAuth2.CustomAuthUser;
import com.Dash.Dashboard.Services.DashboardService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

import static org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction.oauth2AuthorizedClient;

@Service
@Slf4j
public class DashboardServiceImpl implements DashboardService {


    private final WebClient webClient;

    private final UserCreditCheckEventListener userCreditCheckEventListener;

    @Autowired
    DashboardServiceImpl(WebClient webClient, UserCreditCheckEventListener userCreditCheckEventListener) {
        this.webClient = webClient;
        this.userCreditCheckEventListener = userCreditCheckEventListener;
    }


    /**
     * @param client
     * @param oauth2User
     * @return
     * @throws WebClientResponseException
     */
    public Optional<List<Project>> loadAllProjects(OAuth2AuthorizedClient client, OAuth2User oauth2User) throws WebClientResponseException {

        final String userAccount = extractUserDetails(oauth2User);

        // Encode url with username
        final String resourceUrl = UriComponentsBuilder.
                fromUriString("http://dash-resource-server:8081/api/v1/resources/projects/{userAccount}")
                .buildAndExpand(userAccount).toUriString();

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
     * @param datasetDescription
     * @param csvFile
     * @return
     * @throws WebClientException
     */
    public Optional<Project> createProject(OAuth2AuthorizedClient client, OAuth2User oauth2User, String projectName,
                                           String datasetDescription, String columnDescriptions, MultipartFile csvFile) throws WebClientResponseException, JsonProcessingException {

        final String userAccount = extractUserDetails(oauth2User);

        verifyUserCreditCount(userAccount);

        final String projectId = UUID.randomUUID().toString();

        final String projectKey = userAccount.concat("/").concat("project-").concat(projectId);

        final Project templateProject = Project.builder().projectId(projectId).projectName(projectName)
                .projectConfigLink(projectKey.concat("/").concat(projectId.concat(".json")))
                .projectCsvLink(projectKey.concat("/").concat(projectId.concat(".csv")))
                .datasetDescription(datasetDescription).widgets(new ArrayList<>())
                .columnDescriptions(Arrays.asList(columnDescriptions.split(">")))
                .creationDate(getCurrentDate())
                .build();


        final String createProjectUrl = UriComponentsBuilder.fromUriString("http://dash-resource-server:8081/api/v1/resources/project")
                .toUriString();

        MultipartBodyBuilder csvBuilder = new MultipartBodyBuilder();
        csvBuilder.part("csv-file", csvFile.getResource());

        // Make HTTP request to upload CSV sheet + create Project JSON (create project folder + project json file)
        return this.webClient.post()
                .uri(createProjectUrl)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(csvBuilder.build())
                .with("template-project", templateProject))
                .attributes(oauth2AuthorizedClient(client))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Optional<Project>>() {})
                .block();
    }




    /**
     *
     * @param client
     * @param projects
     * @return
     * @throws WebClientResponseException
     */
    public Optional<Object> updateProjects(OAuth2AuthorizedClient client, List<Project> projects) throws WebClientResponseException {

        final String updateProjectUrl = UriComponentsBuilder
                .fromUriString("http://dash-resource-server:8081/api/v1/resources/projects").toUriString();

        return this.webClient.put()
                .uri(updateProjectUrl)
                .attributes(oauth2AuthorizedClient(client))
                .body(BodyInserters.fromValue(projects))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Optional<Object>>() {})
                .block();
    }




    /**
     *
     * @param client
     * @param projectId
     * @return
     * @throws WebClientResponseException
     */
    public Optional<String> deleteProject(OAuth2AuthorizedClient client, OAuth2User oauth2User, String projectId) throws WebClientResponseException {

        // TODO OAuth2 User email -> extract for userId inside service
        String userAccount = extractUserDetails(oauth2User);

        final String deleteProjectUrl = UriComponentsBuilder
                .fromUriString("http://dash-resource-server:8081/api/v1/resources/project")
                .queryParam("user-account", userAccount)
                .queryParam("project-id", projectId)
                .toUriString();

        return this.webClient.delete()
                .uri(deleteProjectUrl)
                .attributes(oauth2AuthorizedClient(client))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Optional<String>>() {})
                .block();
    }




    /**
     *
     *  Utility methods
     *
     */

    public void verifyUserCreditCount(String userEmail) throws NotEnoughCreditsException {
        userCreditCheckEventListener.onApplicationEvent(new UserCreditCheckEvent(userEmail));
    }

    public static String extractUserDetails(OAuth2User oauth2User) {
        final CustomAuthUser customAuthUser = new CustomAuthUser(oauth2User);
        return customAuthUser.getEmail();
    }

    private static Date getCurrentDate() {
        final Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        return new Date(calendar.getTime().getTime());
    }

}
