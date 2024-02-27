package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Entites.Role;
import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Entites.VerificationToken;
import com.Dash.Dashboard.Models.UserRegistrationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.TaskExecutor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientException;

import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;


@Slf4j
@Service
public class AuthenticationService {

    // Dependency injections done by constructor (all private and final fields)
    private final MongoTemplate userDAO;
    private final MongoTemplate verificationTokenDAO;
    private final PasswordEncoder passwordEncoder;
    private final TaskExecutor taskExecutor;


    @Autowired
    AuthenticationService(@Qualifier("userMongoTemplate") MongoTemplate userDAO,
                          @Qualifier("verificationMongoTemplate") MongoTemplate verificationTokenDAO,
                          PasswordEncoder passwordEncoder,
                          TaskExecutor taskExecutor) {
        this.userDAO = userDAO;
        this.verificationTokenDAO = verificationTokenDAO;
        this.passwordEncoder = passwordEncoder;
        this.taskExecutor = taskExecutor;
    }




    /**
     *
     * @param email
     * @return
     * @throws WebClientException
     */
    public ResponseEntity<String> sendActivationRequest(String email) throws WebClientException {

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
        final User tempUser = User.builder().email(email).enabled(false).build();

        userDAO.insert(tempUser);

        // Generate an activation key that is linked with this user ONLY
        final String activationKey = UUID.randomUUID().toString();

        final VerificationToken verificationToken = new VerificationToken(tempUser, activationKey);

        verificationTokenDAO.insert(verificationToken);

        return sendVerificationEmail(email, activationKey);
    }




    /**
     *
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
            return new ResponseEntity<>("Account successfully activated!", HttpStatus.CREATED);


        return new ResponseEntity<>("Account could not be activated at the moment", HttpStatus.BAD_GATEWAY);
    }




    /**
     *
     * @param registrationRequest
     * @return
     * @throws WebClientException
     */
    public ResponseEntity<String> register(UserRegistrationRequest registrationRequest) throws WebClientException {

        // Ensure account has been activated (from emailed activation key)
        final Query oldUser = new Query(Criteria.where("email").is(registrationRequest.getEmail()));

        Optional<User> user = Optional.ofNullable(userDAO.findOne(oldUser, User.class));

        if (user.isPresent() && !user.get().isEnabled()) {
            return new ResponseEntity<>("An account associated with this email has not been activated yet", HttpStatus.UNAUTHORIZED);
        } else if (user.isEmpty()) {
            return new ResponseEntity<>("The provided email is not associated with an account", HttpStatus.UNAUTHORIZED);
        }

        // Build verified customer
        final Update registeredUser = new Update()
                    .set("firstName", registrationRequest.getFirstName())
                    .set("lastName", registrationRequest.getLastName())
                    .set("password", passwordEncoder.encode(registrationRequest.getPassword()))
                    .set("phoneNumber", registrationRequest.getPhoneNumber())
                    .set("role", Role.USER);


        // Update customer
        userDAO.updateFirst(oldUser, registeredUser, User.class);

        // Send dashboard request
        return new ResponseEntity<>("Successfully Registered!", HttpStatus.CREATED);
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



    /**
     *
     * @param userId
     * @return
     * @throws WebClientException
     */
    private boolean activateAccount(String userId) throws WebClientException {
        final Query oldUser = new Query(Criteria.where("id").is(userId));
        final Update activatedUser = Update.update("enabled", true);
        return userDAO.updateFirst(oldUser, activatedUser, User.class).wasAcknowledged();
    }



    /**
     *
     * @param userId
     * @return
     */
    private String generateNewVerificationToken(String userId) {
        final String activationKey = UUID.randomUUID().toString();

        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, 3); // TODO

        final Query query = new Query(Criteria.where("userId").is(userId));

        final Update update = new Update()
                .set("activationKey", activationKey)
                .set("expirationDate", new Date(calendar.getTime().getTime()));

        verificationTokenDAO.updateFirst(query, update, VerificationToken.class);

        return activationKey;
    }



    // TODO *** *** *** *** *** *** *** (ASYNC)
    /**
     *
     * @param email
     * @param activationToken
     * @return
     */
    private ResponseEntity<String> sendVerificationEmail(String email, String activationToken) throws WebClientException {
        try {
            final String url = "www.ur-email.com"; //getApplicationUrl() + "/verifyRegistration?token= + token;

            taskExecutor.execute(() -> {
                // Send email with activation token/key
                log.warn("ASYNC");
            });

            return new ResponseEntity<>("Activation key was successfully sent to " + email, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Activation key could not be sent at the moment", HttpStatus.BAD_REQUEST);
        }
    }

}
