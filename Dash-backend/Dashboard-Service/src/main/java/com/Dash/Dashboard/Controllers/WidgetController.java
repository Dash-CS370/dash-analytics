package com.Dash.Dashboard.Controllers;

import com.Dash.Dashboard.Models.Widget;
import com.Dash.Dashboard.Services.WidgetService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;



// TODO IN PROGRESS -- HALT FOR NOW ******************
@Slf4j
@RestController
@RequestMapping("/my-dashboard/workspace")
public class WidgetController {

    private final WidgetService widgetService;

    WidgetController(WidgetService widgetService) {
        this.widgetService = widgetService;
    }


    // TODO - use client for ASYNC CALLS -> MAKE FRONTEND SEND ME 1 JSON OBJECTS!
    /** While working on a project, allow user to add new Widget */
    @PostMapping(value = "/add-widget")
    public ResponseEntity<Object> addWidget(@RequestPart("project-config-link") String projectLink,
                                            @RequestPart("widget") Widget widget) {
        try {

            final Optional<String> projectJsonLink = sanitize(projectLink);

            if (projectJsonLink.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            final Optional<Object> addedWidget = widgetService.addWidget(projectLink, widget);

            if (addedWidget.isPresent()) {

            }

            return new ResponseEntity<>(HttpStatus.CREATED);

        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // TODO --> TO UPDATE PASS IN NEW FIELDS OR UPDATED JSON OBJ
    /** While working on a project, allow user to update widget */
    @PutMapping("/{widget-id}")
    public ResponseEntity<Object> updateWidget(@PathVariable("widget-id") String widgetId,
                                               @RequestPart("project-config-link") String projectLink,
                                               @RequestPart("widget") Widget widget) {
        try {

            final Optional<String> projectJsonLink = sanitize(projectLink);

            if (projectJsonLink.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // TODO  ---> FIGURE OUT LOGIC
    /** While working on a project, allow user to delete a Widget */
    @DeleteMapping("/{widget-id}")
    public ResponseEntity<Object> deleteWidget(@PathVariable("widget-id") String widgetId,
                                               @RequestPart("project-config-link") String projectLink) {
        try {

            final Optional<String> projectJsonLink = sanitize(projectLink);

            if (projectJsonLink.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return new ResponseEntity<>(HttpStatus.ACCEPTED);

        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // TODO
    private static Optional<String> sanitize(String link) {
        if (link.endsWith(".csv")) {
            return Optional.of(link.replace(".csv", ".json"));
        } else if (link.endsWith(".json")) {
            return Optional.of(link);
        }
        return Optional.empty();
    }

}
