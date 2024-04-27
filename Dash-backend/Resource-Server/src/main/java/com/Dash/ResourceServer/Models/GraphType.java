package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GraphType {

    LINE_GRAPH("LINE_GRAPH", "A line chart that displays information as a series of data points " +
            "Helps visualize how numerical variables change over the specified interval. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): MUST INCLUDE 2 OR MORE COLUMNS CONSISTING OF 1 OR MORE NUMERICAL COLUMNS AND ALWAYS 1 TEMPORAL COLUMN."),

    BAR_GRAPH("BAR_GRAPH", "A chart that represents categorical data with rectangular bars with heights or lengths proportional to " +
            "the numerical values they represent. Versatile for comparing numerical quantities across different categories." +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): MUST INCLUDE 2 OR MORE COLUMNS, WHERE 1 & ONLY ONE MUST BE CATEGORICAL AND THE OTHER(S) NUMERICAL."),

    SCATTER_PLOT("SCATTER_PLOT", "A graph that uses dots to represent values obtained for two different numerical variables, showing " +
            "the relationship between them. It's particularly useful for spotting outliers, and observing distribution trends in numerical data. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): MUST INCLUDE ONLY 2 NUMERICAL COLUMNS."),

    AREA_CHART("AREA_CHART", "A line chart where the area between the line and the axis is filled with color or shading, representing " +
            "the cumulative value of numerical data over time. It is used for visualizing how one or more numerical quantities grow or decline over time or another continuous interval. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): MUST INCLUDE AT LEAST 2 COLUMNS consisting of 1 OR MORE NUMERICAL COLUMNS AND ALWAYS 1 TEMPORAL COLUMN." +
            "AVOID USING OVER LINE GRAPH IF ACCUMULATION OF THE VARIABLE(S) IS NOT MEANINGFUL"),

    STATISTICS_CARD("STATISTICS_CARD", "A compact display including essential statistics for columns. " +
                    "This ensures a comprehensive summary of the data's central tendency and dispersion, suitable for quick insights into the dataset's characteristics." +
                    "REQUIREMENT (IF APPLICABLE TO THE COLUMN USED BY THE WIDGET): MUST INCLUDE ONLY 1 NUMERICAL OR CATEGORICAL COLUMN.");


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


    public enum ColumnCategory {

        NUMERICAL("NUMERICAL", "Represents quantitative data that can be measured and ordered. Examples include height, weight, and age."),
        CATEGORICAL("CATEGORICAL", "Represents qualitative data that categorizes into distinct groups. Examples include breed, color, and type."),
        TEMPORAL("TEMPORAL", "Represents time-based data that indicates when events occur. Examples include dates, timestamps, and periods."),
        IDENTIFIER("IDENTIFIER", "Represents unique identifiers used to distinguish between different entities. Examples include dog ID, user ID, and transaction numbers.");

        private final String value;
        private final String description;

        ColumnCategory(String value, String description) {
            this.value = value;
            this.description = description;
        }

        public String getValue() {
            return value;
        }

        public String getDescription() {
            return description;
        }
    }


}
