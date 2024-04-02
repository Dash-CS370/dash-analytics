package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class RequestDTO {

    @JsonProperty("dataset_description")
    private String datasetDescription;

    @JsonProperty("column_data")
    private List<String> columnData;

}
