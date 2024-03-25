package com.Dash.Authorization.Controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Slf4j
@Controller
public class LogoutController {


    @ResponseBody
    @GetMapping("/logout/user")
    public void doLogout(HttpSession session, HttpServletRequest request, HttpServletResponse response) {

        log.warn("ENTERED LOGOUT POINT");

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
        response.addCookie(cookieWithSlash); // For Tomcat
    }

}
