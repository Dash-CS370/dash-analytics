package com.Dash.Dashboard.Services.Impl;

import com.Dash.Dashboard.Entites.PasswordResetToken;
import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Services.EmailService;
import com.Dash.Dashboard.Services.PasswordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;


@Slf4j
@Service
public class PasswordServiceImpl implements PasswordService {

    private final MongoTemplate passwordResetTokenDAO;

    private final MongoTemplate userDAO;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    @Autowired
    public PasswordServiceImpl(@Qualifier("passwordResetMongoTemplate") MongoTemplate passwordResetTokenDAO,
                               @Qualifier("userMongoTemplate") MongoTemplate userDAO,
                               PasswordEncoder passwordEncoder,
                               EmailService emailService) {
        this.passwordResetTokenDAO = passwordResetTokenDAO;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.userDAO = userDAO;
    }



    /**
     *
     * @param userEmail
     * @return
     */
    public ResponseEntity<String> initiatePasswordResetProcess(String userEmail) {
        Optional<User> user = Optional.ofNullable(
                userDAO.findOne(new Query(Criteria.where("email").is(userEmail)), User.class)
        );

        if (user.isEmpty())
            return new ResponseEntity<>("An account associated with this email DOES NOT exist..." , HttpStatus.BAD_REQUEST);
        if (!user.get().isEnabled())
            return new ResponseEntity<>("An account associated with this email has not been activated yet..." , HttpStatus.BAD_REQUEST);
        if (user.get().getPassword() == null)
            return new ResponseEntity<>("An account associated with this email has not been fully registered..." , HttpStatus.BAD_REQUEST);


        // Check if user has a password reset token
        Optional<PasswordResetToken> linkedPasswordResetToken = Optional.ofNullable(
                passwordResetTokenDAO.findOne(new Query(Criteria.where("user").is(user.get())), PasswordResetToken.class)
        );

        final String resetPasswordKey;

        // Update the password reset token
        if (linkedPasswordResetToken.isPresent()) {
            final String resetPasswordLink = sendPasswordResetEmail(userEmail, regeneratePasswordResetToken(user.get().getId()));
            return new ResponseEntity<>("New Password Reset Key was sent with the following link : " + resetPasswordLink,
                    HttpStatus.OK);
        }

        // When an existing account that is enabled exists AND they have NOT REQUESTED to reset their password before, then
        resetPasswordKey = UUID.randomUUID().toString();

        passwordResetTokenDAO.insert(new PasswordResetToken(user.get(), resetPasswordKey));

        String resetPasswordLink = sendPasswordResetEmail(userEmail, resetPasswordKey);

        return new ResponseEntity<>("Email with password reset link has been sent with the following link: " + resetPasswordLink, HttpStatus.CREATED);
    }



    /**
     *
     * @param resetPasswordKey
     * @return
     */
    public Optional<PasswordResetToken> verifyPasswordResetKey(String resetPasswordKey) {
        Optional<PasswordResetToken> passwordResetToken = Optional.ofNullable(
                passwordResetTokenDAO.findOne(new Query(Criteria.where("resetPasswordKey").is(resetPasswordKey)), PasswordResetToken.class)
        );

        return passwordResetToken.isPresent() && !hasExpired(passwordResetToken.get()) ? passwordResetToken : Optional.empty();
    }



    /**
     *
     * @param resetPasswordKey
     * @param newPassword
     * @return
     */
    public ResponseEntity<String> resetUserPassword(String resetPasswordKey, String newPassword) {
        Optional<PasswordResetToken> passwordResetToken = Optional.ofNullable(
                passwordResetTokenDAO.findOne(new Query(Criteria.where("resetPasswordKey").is(resetPasswordKey)), PasswordResetToken.class)
        );

        if (passwordResetToken.isEmpty() || hasExpired(passwordResetToken.get()))
            return new ResponseEntity<>("Password Reset Token is invalid or expired..." , HttpStatus.INTERNAL_SERVER_ERROR);

        // User entity is linked via @DBRef so it must exist
        final User userRequestingToChangePassword = passwordResetToken.get().getUser();

        Query query = new Query(Criteria.where("id").is(userRequestingToChangePassword.getId()));
        Update update = new Update().set("password", passwordEncoder.encode(newPassword));

        if (userDAO.updateFirst(query, update, User.class).wasAcknowledged()) {
            return new ResponseEntity<>("Password reset successfully, redirecting to www.dash-analytics.com/home...", HttpStatus.OK);
        }

        return new ResponseEntity<>("Request could not be complete at this time... " , HttpStatus.INTERNAL_SERVER_ERROR);
    }




    /**
     *  Utility methods
     */
    private String regeneratePasswordResetToken(String userId) {

        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, 60 * 12);

        final String activationKey = UUID.randomUUID().toString();

        Update update = new Update()
                .set("resetPasswordKey", activationKey)
                .set("expirationDate", new Date(calendar.getTime().getTime()));

        passwordResetTokenDAO.updateFirst(new Query(Criteria.where("userId").is(userId)), update, PasswordResetToken.class);

        return activationKey;
    }


    public String sendPasswordResetEmail(String email, String passwordResetKey) {
        try {
            final String resetPasswordUrl = "https://dash-analytics.solutions/api/v1/password/verify?reset-token=" + passwordResetKey;

            final Map<String, Object> model = Map.of("resetPasswordUrl", resetPasswordUrl);

            emailService.sendEmailWithRetries(email, model, "password_reset_email_template.ftl", 3);

            log.info("Password reset key was successfully sent to " + email);

            return resetPasswordUrl;

        } catch (Exception e) {
            log.warn("Password reset key could not be sent at the moment to " + email, e);
            return "";
        }
    }


    private boolean hasExpired(PasswordResetToken passwordResetToken) {
        final Calendar cal = Calendar.getInstance();
        return (passwordResetToken.getExpirationDate().getTime() - cal.getTime().getTime()) <= 0;
    }


}
