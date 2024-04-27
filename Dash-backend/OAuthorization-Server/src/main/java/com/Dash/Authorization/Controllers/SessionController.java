package com.Dash.Authorization.Controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.*;
import java.io.IOException;


@Slf4j
@Controller
public class SessionController {

    @GetMapping("/login")
    public String doLogin() {
        return "login";
    }


    @GetMapping("/user/logout")
    public void doLogout(HttpSession session, HttpServletResponse response, HttpServletRequest request) throws IOException {

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
        //cookieWithSlash.setPath(request.getContextPath() + "/");
        cookieWithSlash.setPath("/");
        cookieWithSlash.setMaxAge(0);
        response.addCookie(cookieWithSlash);

        response.sendRedirect("https://dash-analytics.solutions/signin");
    }

}
