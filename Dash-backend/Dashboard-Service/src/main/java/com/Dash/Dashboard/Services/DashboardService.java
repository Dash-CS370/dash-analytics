package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Models.Project;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Optional;


public interface DashboardService {

    Optional<List<Project>> loadAllProjects(OAuth2AuthorizedClient client, OAuth2User oauth2User) throws WebClientResponseException;

    Optional<Project> createProject(OAuth2AuthorizedClient client, OAuth2User oauth2User, String projectName,
                                    String projectDescription, String columnDescriptions, MultipartFile csvFile) throws WebClientResponseException, JsonProcessingException;

    Optional<Object> updateProjects(OAuth2AuthorizedClient client, List<Project> projects) throws WebClientResponseException;

    Optional<String> deleteProject(OAuth2AuthorizedClient client, OAuth2User oauth2User, String projectId) throws WebClientResponseException;

}
