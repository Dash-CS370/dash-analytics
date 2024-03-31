package com.Dash.ResourceServer.Models;

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
