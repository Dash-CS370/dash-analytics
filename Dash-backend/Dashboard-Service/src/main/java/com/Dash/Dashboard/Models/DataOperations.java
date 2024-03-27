package com.Dash.Dashboard.Models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DataOperations {

    STANDARDIZE("STANDARDIZE", "Transforms data in each column to have a mean of 0 and a standard deviation of 1, ensuring consistency in variance and mean across variables for more accurate comparisons"),
    NORMALIZE("NORMALIZE", "Adjusts the scale of data in each column to a range, typically between 0 and 1, making data points relative to each other within specified bounds"),
    ROLLING_AVERAGE("ROLLING_AVERAGE", "Calculates the moving average over a specified window of rows for each column, smoothing short-term fluctuations and highlighting longer-term trends for visualization"),
    ROLLING_MEDIAN("ROLLING_MEDIAN", "Calculates the moving median over a specified window of rows for each column, offering a robust measure of central tendency over time that mitigates the effect of outliers"),
    CALCULATE_DELTA("CALCULATE_DELTA", "Calculates the change (delta) between consecutive rows in a specified column"),
    CALCULATE_PERCENT_CHANGE("CALCULATE_PERCENT_CHANGE", "Calculates the percentage change between consecutive rows in a specified column"),
    PERCENTAGE_OF_TOTAL("PERCENTAGE_OF_TOTAL", "Calculates percentages of the total for each row in a column"),
    ADD_COLUMN_SUM("ADD_COLUMN_SUM", "Adds a new column with the sum of two specified columns"),
    ADD_COLUMN_DIFFERENCE("ADD_COLUMN_DIFFERENCE", "Adds a new column with the difference between two specified columns"),
    DISCRETIZE_COLUMN("DISCRETIZE_COLUMN", "Splits a numerical column into bins or ranges, essential for histograms");

    private final String value;

    private final String description;

    DataOperations(String value, String description) {
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
    public static DataOperations forValue(String value) {
        for (DataOperations type : DataOperations.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }

}
