package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {

    @NotNull
    @NotEmpty
    @JsonProperty("projectId")
    private String projectId;

    @NotNull
    @NotEmpty
    @JsonProperty("projectName")
    private String projectName;

    @JsonProperty("projectConfigLink")
    private String projectConfigLink;

    @NotNull
    @NotEmpty
    @JsonProperty("projectCsvLink")
    private String projectCsvLink;

    @NotEmpty
    @NotNull
    @JsonProperty("projectDescription")
    private String projectDescription;

    @JsonProperty("createdDate")
    private Date createdDate;

    @JsonProperty("lastModified")
    private Date lastModified;

    @NotNull
    @JsonProperty("widgets")
    private List<Widget> widgets;

}
