package com.Dash.Dashboard.Controllers;

import com.Dash.Dashboard.Services.PasswordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Slf4j
@Controller
@RequestMapping("/user")
public class PasswordController {

    private final PasswordService passwordService;

    @Autowired
    PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }


    /**
     * Initiates the password reset process for a user by generating a Password Reset Token & sending an email with a reset link.
     *
     * @param userEmail The email address provided by the user for password reset.
     * @return ResponseEntity indicating the outcome of the operation, with an appropriate message and HTTP status code.
     */
    @ResponseBody
    @PostMapping(value ="/forgot-password", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> forgotPassword(@RequestPart("email") String userEmail) {
        try {

            if (userEmail.isEmpty()) {
                return new ResponseEntity<>("Email field cannot be empty... ", HttpStatus.BAD_REQUEST);
            }

            return passwordService.initiatePasswordResetProcess(userEmail);

        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong ... " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    /**
     * Verifies the validity of a password reset token. Redirects the user to either the password reset page or error page.
     *
     * @param passwordResetToken The token used to verify the password reset request.
     * @return A URL redirect string to the password reset page if the token is valid, to the forgot password page if invalid, or to an error page upon exception.
     */
    @GetMapping(value ="/reset-password")
    public String verifyPasswordResetToken(@RequestParam("token") String passwordResetToken) {
        try {

            // No need to check if user email / account exists
            return passwordService.verifyPasswordResetKey(passwordResetToken).map(
                    s -> "redirect:https://www.dash-analytics.com/reset-password"
            ).orElseGet(() -> "redirect:https://www.dash-analytics.com/forgot-password");

        } catch (Exception e) {
            log.warn(e.getMessage());
            return "redirect:https://www.dash-analytics.com/oops";
        }
    }




    /**
     * Processes a password reset request by validating the reset token and comparing the new password entries for a match.
     * Consumes multipart/form-data for secure transmission of sensitive information.
     *
     * @param passwordResetKey The token provided to the user for password reset verification.
     * @param passwordReset The new password provided by the user.
     * @param confirmedPasswordReset The new password re-entered by the user for confirmation.
     * @return ResponseEntity with a success message or an error message, including the appropriate HTTP status code.
     */
    @ResponseBody
    @PostMapping(value = "/reset-password", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> resetPassword(@RequestPart("token") String passwordResetKey,
                                                @RequestPart("password-reset") String passwordReset,
                                                @RequestPart("re-enter-password") String confirmedPasswordReset) {
        try {

            if (!passwordReset.equals(confirmedPasswordReset)) {
                return new ResponseEntity<>("Passwords do not match ..." , HttpStatus.BAD_REQUEST);
            }

            return passwordService.resetUserPassword(passwordResetKey, confirmedPasswordReset);

        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong ... " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
