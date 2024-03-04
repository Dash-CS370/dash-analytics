package com.Dash.ResourceServer.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Widget {

    @JsonProperty("name")
    private String widgetName;

    @JsonProperty("bottom-left-X-position")
    private Integer bottomLeftXPosition;

    @JsonProperty("bottom-left-Y-position")
    private Integer bottomLeftYPosition;

    @JsonProperty("top-right-X-position")
    private Integer topRightXPosition;

    @JsonProperty("top-right-Y-position")
    private Integer topRightYPosition;

}
