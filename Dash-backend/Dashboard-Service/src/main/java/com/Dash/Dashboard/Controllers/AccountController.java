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
     * Retrieves user profile information after authentication and session initialization.
     *
     * @param oauth2User The authenticated OAuth2 user.
     * @return ResponseEntity containing the user profile or an internal server error status.
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
     * Reset password logic for user after authentication and session initialization.
     *
     * @param userId The ID of the user whose password is being updated.
     * @param passwordMap A map containing the old and new passwords.
     * @return ResponseEntity indicating the success or failure of the password update.
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
     * Deletes a user account from a signed-in context / authenticated session.
     *
     * @param id The ID of the user to be deleted.
     * @return ResponseEntity indicating the success or failure of the account deletion.
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
     * Logs the user out and clears the session and authentication context.
     *
     * @param session The current HTTP session.
     * @param request The current HTTP request.
     * @param response The HTTP response for redirecting or sending cookies.
     */
    @GetMapping("/logout")
    public void logUserOut(HttpSession session, HttpServletRequest request, HttpServletResponse response) {
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

            response.sendRedirect("https://auth.dash-analytics.solutions/user/logout");

        } catch (Exception e) {
            log.warn(e.getMessage());
        }
    }


}

