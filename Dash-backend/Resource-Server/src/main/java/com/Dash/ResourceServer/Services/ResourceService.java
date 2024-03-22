package com.Dash.ResourceServer.Services;

import com.Dash.ResourceServer.Models.Project;
import com.amazonaws.SdkClientException;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ResourceService {

    List<Project> getProjectsBelongingTo(String userId);

    void uploadProjectFiles(Project projectConfig, MultipartFile csvFile);

    Optional<Object> updateProjects(List<Project> projectsToUpdate) throws JsonProcessingException;

    Optional<String> deleteProject(String userId, String projectId) throws SdkClientException;

    Optional<String> deleteAllUserResources(String userId) throws SdkClientException;

}
