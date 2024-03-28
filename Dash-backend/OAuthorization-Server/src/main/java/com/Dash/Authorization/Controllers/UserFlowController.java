package com.Dash.Authorization.Controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Slf4j
@Controller
public class UserFlowController {

    @GetMapping("/logout/user")
    public String doLogout() {
        return "redirect:http://auth-server:9000/logout";
    }

    @GetMapping("/login")
    public String doLogin() {
        return "login";
    }

}
