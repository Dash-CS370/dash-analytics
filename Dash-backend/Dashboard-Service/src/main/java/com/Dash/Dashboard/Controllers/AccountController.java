package com.Dash.Dashboard.Controllers;

import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Services.AccountService;
import com.Dash.Dashboard.Services.Impl.AccountServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/vera/api")
public class AccountController {


    private final AccountService accountService;

    @Autowired
    AccountController(AccountService accountService) {
        this.accountService = accountService;
    }


    /**
     * @param id
     */
    @DeleteMapping("/delete-user")
    public ResponseEntity<String> deleteUser(@RequestParam String id) {
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



    // TODO -> WORKS
    /**
     *
     * @param id
     * @return
     */
    @GetMapping("/user-profile/{id}")
   public ResponseEntity<User> getUserProfile(@PathVariable String id) {
        try {

            final Optional<User> user = accountService.findUserById(id);

            return user.map(projects -> ResponseEntity.ok().header("Content-Type", "application/json")
                    .body(projects)).orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));

        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    
}
