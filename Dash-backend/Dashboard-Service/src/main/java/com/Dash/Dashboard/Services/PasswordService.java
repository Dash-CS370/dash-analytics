package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Entites.PasswordResetToken;
import com.Dash.Dashboard.Entites.User;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.UUID;

public interface PasswordService {

    public ResponseEntity<String> initiatePasswordResetProcess(String userEmail);

    public Optional<PasswordResetToken> verifyPasswordResetKey(String resetPasswordKey);

    public ResponseEntity<String> resetUserPassword(String resetPasswordKey, String newPassword);

}
