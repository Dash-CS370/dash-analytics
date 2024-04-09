package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Project {

    @JsonProperty("project_id")
    private String projectId;

    @JsonProperty("project_name")
    private String projectName;

    @JsonProperty("project_config_link")
    private String projectConfigLink;

    @JsonProperty("project_csv_link")
    private String projectCsvLink;

    @JsonProperty("project_description")
    private String projectDescription;

    @JsonProperty("column_descriptions")
    private List<String> columnDescriptions;

    @JsonProperty("created_date")
    private Date creationDate;

    @JsonProperty("last_modified")
    private Date lastModified;

    @JsonProperty("widgets")
    private List<Widget> widgets;

}
