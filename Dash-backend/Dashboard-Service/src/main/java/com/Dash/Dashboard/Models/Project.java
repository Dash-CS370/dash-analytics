package com.Dash.Dashboard.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;


/** Little Tab rep Projects of User */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Project { // TODO -> FUTURE

    @Id
    @JsonProperty("projectId")
    private String projectId;

    @JsonProperty("projectName")
    private String projectName;

    @JsonProperty("projectConfigLink")
    private String projectConfigLink;

    @JsonProperty("projectCsvLink")
    private String projectCsvLink;

    @JsonProperty("projectDescription")
    private String projectDescription;

    @JsonProperty("createdDate")
    private Date creationDate;

    @JsonProperty("lastModified")
    private Date lastModified;

    @JsonProperty("widgets")
    private List<Widget> widgets;

}
