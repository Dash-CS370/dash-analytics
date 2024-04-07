package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Models.UserRegistrationRequest;
import org.springframework.http.ResponseEntity;


public interface AuthenticationService {
    ResponseEntity<String> sendActivationRequest(String email);

    ResponseEntity<String> verifyActivationKey(String activationKey);

    ResponseEntity<String> register(UserRegistrationRequest registrationRequest);

    ResponseEntity<String> sendVerificationEmail(String email, String activationToken);

}
