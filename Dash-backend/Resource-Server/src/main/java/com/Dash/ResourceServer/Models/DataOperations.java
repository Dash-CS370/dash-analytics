package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DataOperations {

    DROP_NAN_ROWS("DROP_NAN_ROWS", "Removes rows from the dataset that contain NaN (Not a Number) values in any column"),
    AVERAGE_N_ROWS("AVERAGE_N_ROWS", "Calculates the average of every N rows in the dataset for each column and reduces the dataset accordingly"),
    SLICE("SLICE", "Selects and extracts a subset of rows from the dataset based on specified starting and ending indices"),
    NORMALIZE("NORMALIZE", "Scales the data in each column to have a mean of 0 and a standard deviation of 1"),
    SUMMARIZE("SUMMARIZE", "Generates summary statistics for each column, including mean, median, mode, and standard deviation"),
    GROUP_BY_AVERAGE("GROUP_BY_AVERAGE", "Groups the dataset by a specified column and calculates the average of other columns within each group"),
    CALCULATE_DELTA("CALCULATE_DELTA", "Calculates the change (delta) between consecutive rows in a specified column"),
    CONVERT_DATATYPE("CONVERT_DATATYPE", "Changes the data type of a specified column, such as converting strings to integers or floats to strings");

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
