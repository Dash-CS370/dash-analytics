package com.Dash.Dashboard.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

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

    @JsonProperty("csvSheetLink")
    private String csvSheetLink;

    @JsonProperty("projectDescription")
    private String projectDescription;

    @JsonProperty("lastModified")
    private String lastModified;

    @JsonProperty("widgets")
    private List<Widget> widgets;

}
