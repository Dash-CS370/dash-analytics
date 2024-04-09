package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GraphType {

    PIE_CHART("PIE_CHART", "A circular chart divided into sectors, each representing a proportion of the whole. " +
            "Primarily used for displaying the relative sizes, ideal for visualizing distribution of categories or percentages " +
            "within a single dataset or column. Specifically tailored for categorical data." +
            "REQUIREMENT: INCLUDE 2 COLUMNS, ONE CATEGORICAL COLUMN AND AT LEAST ONE NUMERICAL COLUMN."),

    GAUGE_CHART("GAUGE_CHART", "A chart that resembles a speedometer or a gauge and is used to represent single-value metrics " +
            "of numerical data. It displays data in a semi-circular format with indications for progress or performance, often " +
            "used for displaying the current value within a predetermined range. Best suited for numerical data that represents a part of a whole or a completion percentage. " +
            "REQUIREMENT: INCLUDE 1 NUMERICAL COLUMN."),

    HISTOGRAM("HISTOGRAM", "A type of bar chart that represents the distribution of numerical data by showing the number of data " +
            "points that fall within a range of values. REQUIREMENT: 1 NUMERICAL COLUMN."),

    BOX_PLOT("BOX_PLOT", "A graphical representation of numerical data that shows the distribution through quartiles, highlighting " +
            "the median and outliers. Box plots summarize key aspects of numerical data distribution, such as central tendency, variability, and skewness, over a dataset or column. " +
            "REQUIREMENT: INCLUDE 1 NUMERICAL COLUMN."),

    LINE_GRAPH("LINE_GRAPH", "A line chart that displays information as a series of data points " +
            "Helps visualize how numerical variables change over the specified interval. " +
            "REQUIREMENT: INCLUDE AT LEAST 2 COLUMNS consisting of AT LEAST 1 NUMERICAL COLUMN AND 1 TEMPORAL COLUMN."),

    SCATTER_PLOT("SCATTER_PLOT", "A graph that uses dots to represent values obtained for two different numerical variables, showing " +
            "the relationship between them. It's particularly useful for spotting outliers, and observing distribution trends in numerical data. " +
            "REQUIREMENT: INCLUDE ONLY 2 NUMERICAL COLUMNS."),

    BAR_GRAPH("BAR_GRAPH", "A chart that represents categorical data with rectangular bars with heights or lengths proportional to " +
            "the numerical values they represent. Versatile for comparing numerical quantities across different categories, even over time if categories are ordered chronologically. " +
            "REQUIREMENT: INCLUDE 2 OR MORE COLUMNS, WHERE 1 MUST BE CATEGORICAL AND THE OTHER NUMERICAL.");

    /*
    AREA_CHART("AREA_CHART", "A line chart where the area between the line and the axis is filled with color or shading, representing " +
            "the cumulative value of numerical data over time. It is used for visualizing how one or more numerical quantities grow or decline over time or another continuous interval. " +
            "REQUIREMENT: TWO COLUMNS: AT LEAST ONE NUMERICAL COLUMN AND ANOTHER COLUMN FOR TEMPORAL OR SEQUENTIAL DATA.");
    */








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
