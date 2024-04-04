package com.Dash.Authorization.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/demo")
@RestController
public class DummyController {

    private int counter = 1;

    @GetMapping
    public String demo() {
        return "<h1>This is how many times lil f*ck heads like you have visited this site: " + (counter++) +"<h1>";
    }
}
