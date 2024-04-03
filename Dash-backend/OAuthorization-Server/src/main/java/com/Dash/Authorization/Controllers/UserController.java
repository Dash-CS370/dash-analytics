package com.Dash.Authorization.Controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.*;


@Slf4j
@Controller
@CrossOrigin(origins = "http://127.0.0.1:3000", allowCredentials = "true")
public class UserController {

    @GetMapping("/user/logout")
    public String doLogout(HttpSession session, HttpServletResponse response, HttpServletRequest request) {

        log.warn("USER SESSION TERMINATED");

        session.invalidate();

        final Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            auth.setAuthenticated(false);
            SecurityContextHolder.clearContext();
            SecurityContextHolder.getContext().setAuthentication(null);
        }

        final Cookie cookieWithSlash = new Cookie("JSESSIONID", null);
        cookieWithSlash.setPath(request.getContextPath() + "/");
        cookieWithSlash.setDomain("auth-server");
        cookieWithSlash.setMaxAge(0);
        response.addCookie(cookieWithSlash);

        return "login";
    }

    @GetMapping("/login")
    public String doLogin() {
        return "login";
    }

}
