package com.Dash.Dashboard.Controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/logout")
public class LogoutController {

    @PostMapping("/user")
    public String testLogout(HttpSession session, HttpServletRequest request,
                             HttpServletResponse response)
            throws IOException {

        final Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            auth.setAuthenticated(false);
            SecurityContextHolder.clearContext();
            for (Cookie cookie : request.getCookies()) {
                String cookieName = cookie.getName();
                log.info("cookie name={}", cookieName);
                Cookie cookieToDelete = new Cookie(cookieName, null);
                cookieToDelete.setPath(request.getContextPath() + "/");
                cookieToDelete.setMaxAge(0);
                response.addCookie(cookieToDelete);
            }
            SecurityContextHolder.getContext().setAuthentication(null);
        }

        return "logout";
    }

}
