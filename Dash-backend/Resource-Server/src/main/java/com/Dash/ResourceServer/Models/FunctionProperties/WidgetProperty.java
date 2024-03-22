package com.Dash.ResourceServer.Models.FunctionProperties;

import com.Dash.ResourceServer.Models.DataOperations;
import com.Dash.ResourceServer.Models.GraphType;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Arrays;

public class WidgetProperty {

    @JsonProperty("title")
    StringField title = new StringField("The title of the widget (should be relevant to what the graph is showing)");;

    @JsonProperty("graph_type")
    EnumListProperty graphType = new EnumListProperty("The type of graph being displayed in the widget (should match spelling and case from the provided list of graph types), defined by the GraphType enum", Arrays.stream(GraphType.values()).map(Enum::name).toArray(String[]::new));

    @JsonProperty("data_operations")
    EnumListProperty dataOperations = new EnumListProperty("List of data operations to perform on the dataset to prepare it for graphingData operations to apply, defined by DataOperations enum.", Arrays.stream(DataOperations.values()).map(Enum::name).toArray(String[]::new));

    @JsonProperty("required_columns")
    ListProperty requiredColumns = new ListProperty("Columns required by the widget.");

}
