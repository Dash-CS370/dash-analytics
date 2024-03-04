package com.Dash.ResourceServer.Services;

import lombok.extern.slf4j.Slf4j;

import com.Dash.ResourceServer.Models.Widget;
import com.Dash.ResourceServer.Models.Project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class GPTService {


    //private final OpenAPI gptClient;

    @Autowired
    GPTService() {//OpenAPI gptClient) {
        //this.gptClient = gptClient;
    }


    // TODO
    public Optional<Project> promptGptWith(Project templateProject) {
        // HAVE GPT GENERATE THE WIDGETS?

        templateProject.setWidgets(List.of(new Widget("plot 1", 10, 10, 50, 50), new Widget("plot 2", 60, 10, 100, 50)));

        return Optional.of(templateProject);

    }



}
