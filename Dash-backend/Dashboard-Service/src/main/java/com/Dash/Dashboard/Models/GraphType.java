package com.Dash.Dashboard.Models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GraphType {

    LINE_GRAPH("LINE_GRAPH", ""),
    BAR_GRAPH("BAR_GRAPH", ""),
    SCATTER_PLOT("SCATTER_PLOT", ""),
    AREA_CHART("AREA_CHART", ""),
    STATISTICS_CARD("STATISTICS_CARD", "");

    private final String value;

    private final String description;

    GraphType(String value, String description) {
        this.value = value;
        this.description = description;
    }


    public String getDescription() {
        return this.description;
    }

    @JsonValue
    public String getValue() {
        return this.value;
    }

    @JsonCreator
    public static GraphType forValue(String value) {
        for (GraphType type : GraphType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
