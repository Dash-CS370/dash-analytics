package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DataOperations {

    // TODO - THESE DO NOT MODIFY NUMBER OF ROWS IN A COLUMN
    LOGARITHMIC_SCALING("LOGARITHMIC_SCALING", "Applies a logarithmic scale to the values in a column, useful for handling skewed data and making exponential relationships appear linear"),
    SQUARE_ROOT_TRANSFORM("SQUARE_ROOT_TRANSFORM", "Takes the square root of each value in a column, useful for reducing skewness in data");

    // TODO -> IMPLEMENT IN DATA PIPELINE!!!
    //SLICE("SLICE", "Selects every Nth row from a column, useful for smoothing out visualizations and reducing overhead. This operation helps in managing large datasets by thinning out the data points for a more manageable and clearer presentation.")

    // TODO -> MORE NUANCED, IGNORE FOR NOW
    //ROLLING_AVERAGE("ROLLING_AVERAGE", "Calculates the moving average over a specified window of rows for each column, smoothing short-term fluctuations and highlighting longer-term trends for visualization"),
    //ROLLING_MEDIAN("ROLLING_MEDIAN", "Calculates the moving median over a specified window of rows for each column, offering a robust measure of central tendency over time that mitigates the effect of outliers"),
    //DISCRETIZE_COLUMN("DISCRETIZE_COLUMN", "Splits a numerical column into bins or ranges, essential for histograms");

    // FIXME - REDUNDANT?
    //CALCULATE_DELTA("CALCULATE_DELTA", "Calculates the change (delta) between consecutive rows in a specified column"),
    //PERCENTAGE_OF_TOTAL("PERCENTAGE_OF_TOTAL", "Calculates percentages of the total for each row in a column"),
    //CALCULATE_PERCENT_CHANGE("CALCULATE_PERCENT_CHANGE", "Calculates the percentage change between consecutive rows in a specified column"),


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
