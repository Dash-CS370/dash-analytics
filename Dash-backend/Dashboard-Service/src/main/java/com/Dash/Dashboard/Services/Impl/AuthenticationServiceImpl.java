package com.Dash.Dashboard.Services.Impl;

import com.Dash.Dashboard.Entites.Role;
import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Entites.UserType;
import com.Dash.Dashboard.Entites.VerificationToken;
import com.Dash.Dashboard.Models.UserRegistrationRequest;
import com.Dash.Dashboard.Services.AuthenticationService;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
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
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;



@Slf4j
@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Value("${spring.application.default-start-credits}")
    private int DEFAULT_STARTING_CREDIT_AMOUNT;

    // Dependency injections done by constructor (all private and final fields)
    private final MongoTemplate userDAO;
    private final MongoTemplate verificationTokenDAO;
    private final PasswordEncoder passwordEncoder;
    private final TaskExecutor taskExecutor;
    private final JavaMailSender mailSender;
    private final Configuration freemarkerConfig;


    @Autowired
    AuthenticationServiceImpl(@Qualifier("userMongoTemplate") MongoTemplate userDAO,
                              @Qualifier("verificationMongoTemplate") MongoTemplate verificationTokenDAO,
                              PasswordEncoder passwordEncoder,
                              TaskExecutor taskExecutor,
                              JavaMailSender mailSender,
                              Configuration freemarkerConfig) {
        this.userDAO = userDAO;
        this.verificationTokenDAO = verificationTokenDAO;
        this.passwordEncoder = passwordEncoder;
        this.taskExecutor = taskExecutor;
        this.mailSender = mailSender;
        this.freemarkerConfig = freemarkerConfig;
    }



    /**
     *
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
     */
    public ResponseEntity<String> register(UserRegistrationRequest registrationRequest) {

        // Ensure account has been activated (from emailed activation key)
        final Query unactivatedUser = new Query(Criteria.where("email").is(registrationRequest.getEmail()));

        Optional<User> user = Optional.ofNullable(userDAO.findOne(unactivatedUser, User.class));

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
                    .set("credits", DEFAULT_STARTING_CREDIT_AMOUNT)
                    .set("role", Role.USER)
                    .set("userType", UserType.DASH);

        // Update customer
        userDAO.updateFirst(unactivatedUser, registeredUser, User.class);

        // Send dashboard request
        //return new ResponseEntity<>(registrationRequest.getEmail(), HttpStatus.CREATED);
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
        calendar.add(Calendar.MINUTE, 5); // FIXME -> give user 24 hours

        final Query query = new Query(Criteria.where("userId").is(userId));

        final Update update = new Update()
                .set("activationKey", activationKey)
                .set("expirationDate", new Date(calendar.getTime().getTime()));

        verificationTokenDAO.updateFirst(query, update, VerificationToken.class);

        return activationKey;
    }



    // TODO !!! ASYNC
    public ResponseEntity<String> sendVerificationEmail(String email, String activationToken) {
        try {
            final String verificationUrl = "www.your-email.com/verifyRegistration?token=" + activationToken;

            Map<String, Object> model = new HashMap<>();
            model.put("activationToken", activationToken);
            model.put("verificationUrl", verificationUrl);

            taskExecutor.execute(() -> {
                try {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

                    // Set values from the model
                    String path = "/Users/wenyuanhuizi/Desktop/dash/Dash-backend/Dashboard-Service/src/main/resources/templates/";

                    freemarkerConfig.setDirectoryForTemplateLoading(new File(path));
                    Template t = freemarkerConfig.getTemplate("email_template.ftl");
                    String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);

                    helper.setTo(email); // recipient
                    helper.setText(html, true);
                    helper.setSubject("Email Verification");
                    helper.setFrom("noreply@dashAnalytics.com");

                    mailSender.send(message);
                    log.info("Activation email sent asynchronously to: " + email);
                } catch (MessagingException | IOException | TemplateException e) {
                    log.error("Error sending activation email to: " + email, e);
                }
            });
            return new ResponseEntity<>("Activation key was successfully sent to " + email, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Failed to send activation key to " + email, e);
            return new ResponseEntity<>("Activation key could not be sent at the moment", HttpStatus.BAD_REQUEST);
        }
    }


    private static Date getCurrentDate() {
        final Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        return new Date(calendar.getTime().getTime());
    }


}

