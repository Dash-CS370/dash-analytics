package com.Dash.Dashboard.Services.Impl;

import com.Dash.Dashboard.Entites.Role;
import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Entites.UserType;
import com.Dash.Dashboard.Entites.VerificationToken;
import com.Dash.Dashboard.Models.UserRegistrationRequest;
import com.Dash.Dashboard.Services.AuthenticationService;
import com.Dash.Dashboard.Services.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
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
public class AuthenticationServiceImpl implements AuthenticationService {

    @Value("${spring.application.default-start-credits}")
    private int STARTING_CREDIT_AMOUNT;

    private final MongoTemplate userDAO;

    private final MongoTemplate verificationTokenDAO;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;


    @Autowired
    AuthenticationServiceImpl(@Qualifier("userMongoTemplate") MongoTemplate userDAO,
                              @Qualifier("verificationMongoTemplate") MongoTemplate verificationTokenDAO,
                              PasswordEncoder passwordEncoder,
                              EmailService emailService) {
        this.userDAO = userDAO;
        this.verificationTokenDAO = verificationTokenDAO;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }



    /**
     * @param email
     * @return
     */
    public ResponseEntity<String> sendActivationRequest(String email) {

        // Check if User exists and is already enabled
        Optional<User> user = Optional.ofNullable(
                userDAO.findOne(new Query(Criteria.where("email").is(email)), User.class)
        );

        if (user.isPresent() && user.get().isEnabled()) {
            return new ResponseEntity<>("An account with this email is already in use", HttpStatus.FORBIDDEN);
        } else if (user.isPresent()) {
            // In the case where the user has already sent an activation request to this email account, replace activation Key
            final String activationKey = generateNewVerificationToken(user.get().getId());
            sendVerificationEmail(email, activationKey);
            return new ResponseEntity<>("New Activation Key was sent", HttpStatus.CREATED);
        }

        // Otherwise this is a completely new User (email has not been used)
        final User tempUser = User.builder().
                email(email).
                enabled(false).
                creationDate(getCurrentDate()).
                build();

        userDAO.insert(tempUser);

        // Generate an activation key that is linked with this user ONLY
        final String activationKey = UUID.randomUUID().toString();

        final VerificationToken verificationToken = new VerificationToken(tempUser, activationKey);

        verificationTokenDAO.insert(verificationToken);

        return sendVerificationEmail(email, activationKey);
    }




    /**
     * @param activationKey
     * @return
     */
    public ResponseEntity<String> verifyActivationKey(String activationKey) {

        // Search for verification token with associated activation key
        Optional<VerificationToken> verificationToken = Optional.ofNullable(
                verificationTokenDAO.findOne(new Query(Criteria.where("activationKey").is(activationKey)), VerificationToken.class)
        );

        if (verificationToken.isEmpty())
            return new ResponseEntity<>("Activation Key does not exist", HttpStatus.FORBIDDEN);

        // Check that verification token has not expired
        if (hasExpired(verificationToken.get()))
            return new ResponseEntity<>("Activation Key expired!", HttpStatus.BAD_REQUEST);


        final User linkedUser = verificationToken.get().getUser();

        // Ensure User has NOT already activated account
        if (linkedUser.isEnabled())
            return new ResponseEntity<>("Account has already been activated", HttpStatus.UNAUTHORIZED);

        // Ensure account activation is successful
        if (activateAccount(linkedUser.getId()))
            return new ResponseEntity<>(linkedUser.getEmail(), HttpStatus.OK);

        return new ResponseEntity<>("Account could not be activated at the moment", HttpStatus.BAD_GATEWAY);
    }




    /**
     * @param registrationRequest
     * @return
     */
    public ResponseEntity<String> register(UserRegistrationRequest registrationRequest) {

        // Ensure account has been activated (from emailed activation key)
        final Query unactivatedUser = new Query(Criteria.where("email").is(registrationRequest.getEmail()));

        Optional<User> user = Optional.ofNullable(userDAO.findOne(unactivatedUser, User.class));

        if (user.isPresent() && !user.get().isEnabled()) {
            return new ResponseEntity<>("An account associated with this email has not been activated yet", HttpStatus.BAD_REQUEST);
        } else if (user.isEmpty()) {
            return new ResponseEntity<>("The provided email is not associated with an account", HttpStatus.BAD_REQUEST);
        } else if (user.get().getPassword() != null) {
            return new ResponseEntity<>("The provided email is already associated with a fully registered account", HttpStatus.BAD_REQUEST);
        }

        // Build verified customer
        final Update registeredUser = new Update()
                    .set("name", registrationRequest.getName())
                    .set("password", passwordEncoder.encode(registrationRequest.getPassword()))
                    .set("credits", STARTING_CREDIT_AMOUNT)
                    .set("role", Role.USER)
                    .set("userType", UserType.DASH);

        // Update customer
        userDAO.updateFirst(unactivatedUser, registeredUser, User.class);

        // Send dashboard request
        return new ResponseEntity<>("Successfully registered", HttpStatus.CREATED);
    }




    /**
     *
     * Utility Methods
     *
     */
    private boolean hasExpired(VerificationToken verificationToken) {
        final Calendar cal = Calendar.getInstance();
        return (verificationToken.getExpirationDate().getTime() - cal.getTime().getTime()) <= 0;
    }

    private boolean activateAccount(String userId) {
        final Query oldUser = new Query(Criteria.where("id").is(userId));
        final Update activatedUser = Update.update("enabled", true);
        return userDAO.updateFirst(oldUser, activatedUser, User.class).wasAcknowledged();
    }

    private String generateNewVerificationToken(String userId) {
        final String activationKey = UUID.randomUUID().toString();

        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, 60 * 12);

        final Query query = new Query(Criteria.where("userId").is(userId));

        final Update update = new Update()
                .set("activationKey", activationKey)
                .set("expirationDate", new Date(calendar.getTime().getTime()));

        verificationTokenDAO.updateFirst(query, update, VerificationToken.class);

        return activationKey;
    }



    private ResponseEntity<String> sendVerificationEmail(String email, String activationToken) {
        try {
            final String activateAccountUrl = "https://dash-analytics.solutions/signin?activate=true";

            final Map<String, Object> model = Map.of("activationToken", activationToken, "activateAccountUrl", activateAccountUrl);

            emailService.sendEmailWithRetries(email, model, "account_activate_email_template.ftl", 3);

            return new ResponseEntity<>("Activation key was successfully sent to " + email, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Activation key could not be sent at the moment", HttpStatus.BAD_REQUEST);
        }
    }


    private static Date getCurrentDate() {
        final Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        return new Date(calendar.getTime().getTime());
    }

}
