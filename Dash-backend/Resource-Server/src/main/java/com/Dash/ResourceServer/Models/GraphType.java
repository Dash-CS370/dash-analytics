package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GraphType {

    LINE_GRAPH("LINE_GRAPH", "A line chart that displays information as a series of data points " +
            "Helps visualize how numerical variables change over the specified interval. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): MUST INCLUDE AT LEAST 2 COLUMNS consisting of AT LEAST 1 NUMERICAL COLUMN AND ALWAYS 1 TEMPORAL COLUMN."),

    BAR_GRAPH("BAR_GRAPH", "A chart that represents categorical data with rectangular bars with heights or lengths proportional to " +
            "the numerical values they represent. Versatile for comparing numerical quantities across different categories, even over time if categories are ordered chronologically. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): MUST INCLUDE 2 OR MORE COLUMNS, WHERE 1 MUST BE CATEGORICAL AND THE OTHER NUMERICAL."),

    PIE_CHART("PIE_CHART", "A circular chart divided into sectors, each representing a proportion of the whole. " +
            "Primarily used for displaying the relative sizes, ideal for visualizing distribution of categories or percentages. Specifically tailored for categorical data." +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): MUST INCLUDE 2 COLUMNS, ONE CATEGORICAL COLUMN AND AT LEAST ONE NUMERICAL COLUMN."),

    SCATTER_PLOT("SCATTER_PLOT", "A graph that uses dots to represent values obtained for two different numerical variables, showing " +
            "the relationship between them. It's particularly useful for spotting outliers, and observing distribution trends in numerical data. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): MUST INCLUDE ONLY 2 NUMERICAL COLUMNS."),

    HISTOGRAM("HISTOGRAM", "A type of bar chart that represents the distribution of numerical data by showing the number of data " +
            "points that fall within a range of values." +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN USED BY THE WIDGET): MUST INCLUDE 1 NUMERICAL COLUMN."),

    BOX_PLOT("BOX_PLOT", "A graphical representation of numerical data that shows the distribution through quartiles, highlighting " +
            "the median and outliers. Box plots summarize key aspects of numerical data distribution, such as central tendency, variability, and skewness, over a dataset or column. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN USED BY THE WIDGET): MUST INCLUDE 1 NUMERICAL COLUMN."),

    AREA_CHART("AREA_CHART", "A line chart where the area between the line and the axis is filled with color or shading, representing " +
            "the cumulative value of numerical data over time. It is used for visualizing how one or more numerical quantities grow or decline over time or another continuous interval. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN(S) USED BY THE WIDGET): SAME AS LINE GRAPH BUT INCLUDE AT LEAST 2 NUMERICAL COLUMNS IN ADDITION TO ONT TEMPORAL COLUMN"),

    STATISTICS_CARD("STATISTICS_CARD", "A compact display including essential statistics for numerical columns. " +
                    "For every numerical column, the following statistics MUST be included: Mean, Median, Mode, Percentiles. " +
                    "This ensures a comprehensive summary of the data's central tendency and dispersion, suitable for quick insights into the dataset's characteristics." +
                    "REQUIREMENT (IF APPLICABLE TO THE COLUMN USED BY THE WIDGET): MUST INCLUDE ONLY 1 NUMERICAL COLUMN & NO DATA OPERATIONS WITH THE COLUMN, JUST THE COLUMN.");


    /*
    GAUGE_CHART("GAUGE_CHART", "A chart that resembles a speedometer or a gauge and is used to represent single-value metrics " +
            "of numerical data. It displays data in a semi-circular format with indications for progress or performance, often " +
            "used for displaying the current value within a predetermined range. Best suited for numerical data that represents a part of a whole or a completion percentage. " +
            "REQUIREMENT (IF APPLICABLE TO THE COLUMN USED BY THE WIDGET): MUST INCLUDE 1 NUMERICAL COLUMN."),
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
