package com.Dash.ResourceServer.Models.FunctionProperties;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Arrays;
import java.util.List;

public class EnumListProperty {

    @JsonProperty("type")
    private final String type = "array";

    @JsonProperty("description")
    private String description;

    @JsonProperty("items")
    private EnumItems items;

    EnumListProperty(String description, String[] itemValues) {
        this.description = description;
        this.items = new EnumItems("string", Arrays.asList(itemValues));
    }

    private static class EnumItems {
        @JsonProperty("type")
        private String type;

        @JsonProperty("enum")
        private List<String> enumValues;
        EnumItems(String type, List<String> enumValues) {
            this.type = type;
            this.enumValues = enumValues;
        }
    }

}
