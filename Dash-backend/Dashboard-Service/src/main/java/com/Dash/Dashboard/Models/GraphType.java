package com.Dash.Dashboard.Models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GraphType {

    LINE_GRAPH("LINE_GRAPH", "A line chart that displays a line generated from two columns of data"),
    PIE_CHART("PIE_CHART", "A circular chart divided into sectors, each representing a proportion of the whole"),
    BOX_PLOT("BOX_PLOT", "A graphical representation of data that shows the distribution through quartiles, highlighting the median and outliers"),
    HISTOGRAM("HISTOGRAM", "A type of bar chart that represents the distribution of numerical data by showing the number of data points that fall within a range of values"),
    BAR_GRAPH("BAR_GRAPH", "A chart that represents categorical data with rectangular bars with heights or lengths proportional to the values they represent"),
    SCATTER_PLOT("SCATTER_PLOT", "A graph that uses dots to represent values obtained for two different variables, showing the relationship between them"),
    AREA_CHART("AREA_CHART", "A line chart where the area between the line and the axis is filled with color or shading, representing the cumulative value over time"),
    STACKED_BAR_GRAPH("STACKED_BAR_GRAPH", "A bar graph that represents comparison among discrete categories. Each bar in the chart represents a whole, and segments in the bar represent different parts or categories that make up the whole"),
    HEAT_MAP("HEAT_MAP", "A graphical representation of data where individual values contained in a matrix are represented as colors, useful for visualizing the magnitude of a phenomenon"),
    GAUGE_CHART("GAUGE_CHART", "A chart that resembles a speedometer or a gauge and is used to represent single-value metrics. It displays the data in a semi-circular format with indications for progress or performance");


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
