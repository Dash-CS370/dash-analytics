package com.Dash.Dashboard.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Widget {

    @JsonProperty("widget_id")
    private String id;

    @JsonProperty("widget_title")
    private String title;

    @JsonProperty("graph_type")
    private GraphType graphType;

    @JsonProperty("widget_description")
    private String description;

    @JsonProperty("pinned")
    private boolean pinned;

    //@JsonProperty("column_data_operations")
    //private Map<String, List<DataOperations>> columnDataOperations;

    @JsonProperty("columns")
    private List<String> columns;
}

