package com.Dash.ResourceServer.Services.Impl;

import com.Dash.ResourceServer.Models.Project;
import com.Dash.ResourceServer.Services.ResourceService;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Slf4j
@Service
public class ResourceServiceImpl implements ResourceService {

    @Value("${application.bucket}")
    private String BUCKET;

    private final AmazonS3 amazonS3Client;

    @Autowired
    ResourceServiceImpl(@Qualifier("s3Client") AmazonS3 amazonS3Client) {
        this.amazonS3Client = amazonS3Client;
    }


    /**
     * @param userId
     * @return List<Project>
     */
    public List<Project> getProjectsBelongingTo(String userId) {

        final List<Project> userProjects = new ArrayList<>();

        ListObjectsV2Request listObjectsRequest = new ListObjectsV2Request().withBucketName(BUCKET).withPrefix(userId + "/");

        ListObjectsV2Result listObjectsResponse = amazonS3Client.listObjectsV2(listObjectsRequest);

        // If user has not uploaded anything
        if (listObjectsResponse.getObjectSummaries().isEmpty()) return List.of();

        List<String> projectConfigs = listObjectsResponse.getObjectSummaries().stream().map(S3ObjectSummary::getKey)
                .filter(key -> key.endsWith(".json")).toList();

        for (String projectConfigLink : projectConfigs) {
            S3Object projectConfigObj = amazonS3Client.getObject(BUCKET, projectConfigLink);
            try {
                final byte[] jsonData = IOUtils.toByteArray(projectConfigObj.getObjectContent());
                final Project projectConfig = (new ObjectMapper()).readValue(jsonData, Project.class);
                projectConfig.setLastModified(projectConfigObj.getObjectMetadata().getLastModified());
                userProjects.add(projectConfig);
            } catch (IOException | AmazonServiceException e) {
                log.warn(e.getMessage());
            }
        }

        return userProjects;
    }



    /**
     *
     * @param projectConfig
     * @param csvFile
     */
    public void uploadProjectFiles(Project projectConfig, MultipartFile csvFile) {

        final String jsonString;
        final byte[] csvByteArray;

        try {
            jsonString = (new ObjectMapper()).writeValueAsString(projectConfig);
            csvByteArray = csvFile.getBytes();
        } catch (IOException e) {
            return;
        }

        try (final InputStream csvStream = new ByteArrayInputStream(csvByteArray);
             final InputStream jsonStream = new ByteArrayInputStream(jsonString.getBytes())) {

            // Upload CSV
            final String csvFileLocation = projectConfig.getProjectCsvLink();
            ObjectMetadata csvMetaData = new ObjectMetadata();
            csvMetaData.setContentLength(csvByteArray.length);
            amazonS3Client.putObject(new PutObjectRequest(BUCKET, csvFileLocation, csvStream, csvMetaData));

            // Upload JSON
            final String jsonFileLocation = projectConfig.getProjectConfigLink();
            ObjectMetadata jsonMetaData = new ObjectMetadata();
            jsonMetaData.setContentLength(jsonString.getBytes().length);
            amazonS3Client.putObject(new PutObjectRequest(BUCKET, jsonFileLocation, jsonStream, jsonMetaData));

        } catch (IOException | AmazonServiceException e) {
            log.warn(e.getMessage());
        }

    }




    /**
     * @param projectsToUpdate
     * @return
     */
    public Optional<Object> updateProjects(List<Project> projectsToUpdate) throws JsonProcessingException {

        for (Project project : projectsToUpdate) {
            String projectConfigKey = project.getProjectConfigLink();

            if (amazonS3Client.doesObjectExist(BUCKET, projectConfigKey)) {
                final String jsonString = (new ObjectMapper()).writeValueAsString(project);
                final InputStream jsonStream = new ByteArrayInputStream(jsonString.getBytes());
                ObjectMetadata jsonMetaData = new ObjectMetadata();
                jsonMetaData.setContentLength(jsonString.getBytes().length);
                amazonS3Client.putObject(new PutObjectRequest(BUCKET, projectConfigKey, jsonStream, jsonMetaData));
            }
        }

        return Optional.of(projectsToUpdate);
    }



    /**
     *
     * @param userAccount
     * @param projectId
     * @return
     * @throws SdkClientException
     */
    public Optional<String> deleteProject(String userAccount, String projectId) throws SdkClientException {
        final String projectKey = userAccount.concat("/project-").concat(projectId).concat("/");
        final String configKey = projectKey.concat(projectId + ".json");
        final String csvKey = projectKey.concat(projectId + ".csv");

        if (amazonS3Client.doesObjectExist(BUCKET, csvKey)) {
            amazonS3Client.deleteObject(new DeleteObjectRequest(BUCKET, csvKey));
        } else return Optional.empty();

        if (amazonS3Client.doesObjectExist(BUCKET, configKey)) {
            amazonS3Client.deleteObject(new DeleteObjectRequest(BUCKET, configKey));
        } else return Optional.empty();

        return Optional.of(projectKey);
    }




    /**
     *
     * @param userAccount
     * @throws SdkClientException
     */
    public Optional<String> deleteAllUserResources(String userAccount) throws SdkClientException {
        ListObjectsV2Request listReq = new ListObjectsV2Request().withBucketName(BUCKET).withPrefix(userAccount + "/");
        ListObjectsV2Result listRes;

        do {
            listRes = amazonS3Client.listObjectsV2(listReq);

            for (S3ObjectSummary objectSummary : listRes.getObjectSummaries()) { // max 1000 deletions
                amazonS3Client.deleteObject(BUCKET, objectSummary.getKey());
            }

            listReq.setContinuationToken(listRes.getNextContinuationToken());

        } while (listRes.isTruncated());

        log.warn("Deleted all files in directory: " + userAccount + "/");

        return Optional.of(userAccount);
    }


}
