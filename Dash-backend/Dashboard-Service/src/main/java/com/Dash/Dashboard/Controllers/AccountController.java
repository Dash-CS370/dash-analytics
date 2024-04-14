package com.Dash.Dashboard.Controllers;

import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Services.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/user")
public class AccountController {

    private final AccountService accountService;

    @Autowired
    AccountController(AccountService accountService) {
        this.accountService = accountService;
    }


    /**
     * @param oauth2User
     * @return
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@AuthenticationPrincipal OAuth2User oauth2User) {
        try {

            final Optional<User> user = accountService.pullUserProfile(oauth2User);

            return user.map(projects -> ResponseEntity.ok().header("Content-Type", "application/json")
                    .body(projects)).orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }



    /**
     *
     * @param userId
     * @param passwordMap
     * @return
     */
    @PostMapping("/update-password/{userId}")
    public ResponseEntity<String> updatePassword(@PathVariable String userId, @RequestBody Map<String, String> passwordMap) {
        try {
            final String oldPassword = passwordMap.get("old-password");
            final String newPassword = passwordMap.get("new-password");

            if (accountService.updateUserPassword(userId, oldPassword, newPassword)) {
                return ResponseEntity.ok("Password updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update password");
            }
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }



    /**
     *
     * @param id
     * @return
     */
    @DeleteMapping("/account")
    public ResponseEntity<String> deleteUserAccount(@RequestParam String id) {
        try {
            Optional<String> deletionConfirmation = accountService.deleteUserById(id);

            return deletionConfirmation.map(projects -> ResponseEntity.ok().body("Successfully deleted"))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.BAD_REQUEST));
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }



    /**
     *
     * @param session
     * @param request
     * @param response
     */
    @GetMapping("/logout")
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

            response.sendRedirect("https://auth.dash-analytics.solutions/user/logout"); //FIXME

        } catch (Exception e) {
            log.warn(e.getMessage());
        }
    }



}

