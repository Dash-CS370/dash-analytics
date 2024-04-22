package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Widget {

    /*
    @JsonProperty("id")
    private String id;
    */

    @JsonProperty("title")
    private String title;

    @JsonProperty("graph_type")
    private GraphType graphType;

    @JsonProperty("description")
    private String description;

    /*
    @JsonProperty("pinned")
    private boolean pinned;
    */

    @JsonProperty("columns")
    private List<String> columns;
}

