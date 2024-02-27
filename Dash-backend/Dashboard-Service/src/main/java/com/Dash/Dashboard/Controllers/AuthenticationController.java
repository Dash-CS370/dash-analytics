package com.Dash.Dashboard.Controllers;

import com.Dash.Dashboard.Models.UserRegistrationRequest;
import com.Dash.Dashboard.Services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @Autowired
    AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }



    /**
     * Initiates an access request on behalf of a user based on their email.
     *
     * @param userEmail The user's email address to send the activation request to.
     * @return ResponseEntity with either a success message or an error message and appropriate HTTP status code.
     */
    @GetMapping(value = "/request-access")
    public ResponseEntity<String> getAccess(@RequestParam("email") String userEmail) {
        try {

            if (userEmail == null || userEmail.isEmpty()) {
                return new ResponseEntity<>("Request was empty", HttpStatus.BAD_REQUEST);
            }

            return authenticationService.sendActivationRequest(userEmail);

        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong... "  + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    /**
     * Activates a user account using an API key.
     *
     * @param activationKey The unique key provided for account activation.
     * @return ResponseEntity with success or error message, including an appropriate HTTP status code.
     */
    @GetMapping(value = "/activate-account")
    public ResponseEntity<String> verifyRegistration(@RequestParam("key") String activationKey) {
        try {

            if (activationKey.isEmpty()) {
                return new ResponseEntity<>("No activation key provided", HttpStatus.BAD_REQUEST);
            }

            return authenticationService.verifyActivationKey(activationKey);

        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong... " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    /**
     * Registers a new user account based on the provided registration details.
     *
     * @param registrationRequest Contains the user's registration data.
     * @param bindingResult Contains validation results.
     * @return ResponseEntity with either success message or error details, including HTTP status code.
     */
    @PostMapping(value = "/register-account", consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegistrationRequest registrationRequest,
                                               BindingResult bindingResult) {
        try {

            if (registrationRequest == null) {
                return new ResponseEntity<>("Request was empty", HttpStatus.BAD_REQUEST);
            }

            if (bindingResult.hasErrors()) {

                final String errorList = bindingResult.getAllErrors().toString();

                // TODO -> FRONTEND DISPLAY OF SPECIFIC INCORRECT FIELDS
                if (errorList.contains("password") || errorList.contains("email")) {
                    return new ResponseEntity<>("Password or Email fields are invalid ...", HttpStatus.BAD_REQUEST);
                }
                else if (errorList.contains("phoneNumber")) {
                    return new ResponseEntity<>("Invalid Phone-Number format ...", HttpStatus.BAD_REQUEST);
                }
                else {
                    return new ResponseEntity<>("Names must be between 2 - 20 characters ...", HttpStatus.BAD_REQUEST);
                }

            }

            return authenticationService.register(registrationRequest);

        } catch (Exception e) {
            return new ResponseEntity<>("Something went wrong ... " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
