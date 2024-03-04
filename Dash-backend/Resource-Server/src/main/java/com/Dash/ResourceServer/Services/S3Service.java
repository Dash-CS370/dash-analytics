package com.Dash.ResourceServer.Services;

import com.Dash.ResourceServer.Models.Project;
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
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class S3Service {

    @Value("${application.bucket}")
    private String BUCKET;

    private final static String S3URL = "https://dash-analytics-test.s3.amazonaws.com/";

    private final AmazonS3 amazonS3Client;

    @Autowired
    S3Service(@Qualifier("s3Client") AmazonS3 amazonS3Client) {
        this.amazonS3Client = amazonS3Client;
    }


    /**
     * @param userId
     * @return List<Project>
     */
    public List<Project> getProjectsBelongingTo(String userId) {

        ListObjectsV2Request listObjectsRequest = new ListObjectsV2Request().withBucketName(BUCKET).withPrefix(userId + "/");

        ListObjectsV2Result listObjectsResponse = amazonS3Client.listObjectsV2(listObjectsRequest);

        List<String> projectConfigs = listObjectsResponse.getObjectSummaries().stream()
                .map(S3ObjectSummary::getKey).filter(key -> key.endsWith(".json")).toList();

        final List<Project> userProjects = new ArrayList<>();

        ObjectMapper objectMapper = new ObjectMapper();

        for (String projectConfigLink : projectConfigs) {
            S3Object projectConfigObj = amazonS3Client.getObject(BUCKET, projectConfigLink);

            try {
                final byte[] jsonData = IOUtils.toByteArray(projectConfigObj.getObjectContent());
                final Project projectConfig = objectMapper.readValue(jsonData, Project.class);
                projectConfig.setLastModified(projectConfigObj.getObjectMetadata().getLastModified().toString());
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
    //@Async
    public void uploadProjectFiles(Project projectConfig, MultipartFile csvFile) {

        // TODO - UNDER CONSTRUCTION
        //log.warn("RUNS ASYNC");

        final String jsonString;
        final byte[] csvByteArray;

        try {
            jsonString = (new ObjectMapper()).writeValueAsString(projectConfig);
            csvByteArray = csvFile.getBytes();
        } catch (JsonProcessingException e) {
            log.warn("Error converting projectConfig to JSON: {}", e.getMessage());
            return;
        } catch (IOException e) {
            log.warn("Error reading bytes from csvFile: {}", e.getMessage());
            return;
        }

        try (final InputStream csvStream = new ByteArrayInputStream(csvByteArray);
             final InputStream jsonStream = new ByteArrayInputStream(jsonString.getBytes())) {

            // Upload CSV
            final String csvFileLocation = projectConfig.getCsvSheetLink();
            ObjectMetadata csvMetaData = new ObjectMetadata();
            csvMetaData.setContentLength(csvByteArray.length);
            amazonS3Client.putObject(new PutObjectRequest(BUCKET, csvFileLocation, csvStream, csvMetaData));

            // Upload Json
            final String jsonFileLocation = csvFileLocation.replace(".csv", ".json");
            ObjectMetadata jsonMetaData = new ObjectMetadata();
            jsonMetaData.setContentLength(jsonString.getBytes().length);
            amazonS3Client.putObject(new PutObjectRequest(BUCKET, jsonFileLocation, jsonStream, jsonMetaData));

        } catch (IOException | AmazonServiceException e) {
            log.warn(e.getMessage());
        }

    }




    //@Async
    /**
     *
     * @param projectCsvKey
     * @return
     * @throws SdkClientException
     */
    public Optional<String> deleteProject(String projectCsvKey) throws SdkClientException {
        if (amazonS3Client.doesObjectExist(BUCKET, projectCsvKey)) {
            amazonS3Client.deleteObject(new DeleteObjectRequest(BUCKET, projectCsvKey));
        } else return Optional.empty();

        final String projectConfigKey = projectCsvKey.replace(".csv", ".json");

        if (amazonS3Client.doesObjectExist(BUCKET, projectConfigKey)) {
            amazonS3Client.deleteObject(new DeleteObjectRequest(BUCKET, projectConfigKey));
        } else return Optional.empty();

        return Optional.of(projectConfigKey);
    }





    // TODO --> ASYNC???)
    // UPDATE Project.json config file by adding/deleting/or modifying its widgets
    /**
     * @param projectsToUpdate
     * @return
     */
    @Async
    public Void updateProjects(List<Project> projectsToUpdate) {
        // Let's get the parsed JSON object (Project)
        // So that we can rewrite the old projects
        return null;
    }


}
