package com.Dash.Dashboard.Controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Slf4j
@Controller
@RequestMapping("/log-out")
public class LogoutController {

    @GetMapping("/")
    public void testLogout(HttpSession session, HttpServletRequest request, HttpServletResponse response) {
        try {

            session.invalidate();

            final Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null) {
                new SecurityContextLogoutHandler().logout(request, response, auth);
                auth.setAuthenticated(false);
                SecurityContextHolder.clearContext();
                for (Cookie cookie : request.getCookies()) {
                    String cookieName = cookie.getName();
                    Cookie cookieToDelete = new Cookie(cookieName, null);
                    log.info("cookie name = {}", cookieName);
                    cookieToDelete.setPath(request.getContextPath() + "/");
                    cookieToDelete.setMaxAge(0);
                    response.addCookie(cookieToDelete);
                }
                SecurityContextHolder.getContext().setAuthentication(null);
            }

            response.sendRedirect("http://127.0.0.1/logout/user");

        } catch (Exception e) {
            log.warn(e.getMessage());
        }
    }

}
