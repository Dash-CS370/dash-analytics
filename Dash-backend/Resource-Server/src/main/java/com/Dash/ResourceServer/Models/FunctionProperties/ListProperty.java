package com.Dash.ResourceServer.Models.FunctionProperties;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ListProperty {

    @JsonProperty("type")
    private final String type = "array";

    @JsonProperty("description")
    private String description;

    @JsonProperty("items")
    private Items items;

    ListProperty(String description) {
        this.description = description;
        this.items = new Items("string");
    }

    private static class Items {
        @JsonProperty("type")
        private String type;
        Items(String type) {
            this.type = type;
        }
    }
}
