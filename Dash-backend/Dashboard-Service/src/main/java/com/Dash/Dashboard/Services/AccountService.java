package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Entites.User;
import com.mongodb.client.result.DeleteResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
public class AccountService {

    private WebClient webClient;

    private final MongoTemplate userDAO;

    private final PasswordEncoder passwordEncoder;


    @Autowired
    AccountService(@Qualifier("userMongoTemplate") MongoTemplate userDAO, PasswordEncoder passwordEncoder, WebClient webClient) {
            this.userDAO = userDAO;
            this.webClient = webClient;
            this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findUserById(String id) {
        return Optional.ofNullable(userDAO.findById(id, User.class));
    }


    public Optional<String> deleteUserById(String id) {
        try {
            // TODO -> 2 steps -> remove from mongo AND delete resources from S3
            DeleteResult deleteResult = userDAO.remove(Query.query(Criteria.where("email").is(id)), User.class);

            // MAKE HTTP request to Resource Server
            // call resource-server/delete-user/{userId} where userId is the email
            final String deleteUserUrl = UriComponentsBuilder // FIXME
                    .fromUriString("http://127.0.0.1:8081/resources/api/delete-user")
                    .queryParam("userId", id)
                    .buildAndExpand().toUriString();

            log.warn(deleteUserUrl);

            log.info("Deleted count: {}", deleteResult.getDeletedCount());

            return this.webClient.delete()
                    .uri(deleteUserUrl)
                    //.attributes(oauth2AuthorizedClient(client))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Optional<String>>() {})
                    .block();

        } catch (Exception e) {
            log.error("Error deleting user with ID " + id, e);
            return Optional.empty();
        }
    }



    // TODO - Works
    public boolean updateUserPassword(String id, String oldPassword, String newPassword) {
        try {
            Optional<User> queriedUser = Optional.ofNullable(userDAO.findById(id, User.class));

            if (queriedUser.isEmpty()) {
                log.info("User with ID: {} not found", id);
                return false;
            }

            final User user = queriedUser.get();

            if (passwordEncoder.matches(oldPassword, user.getPassword())) {
                log.warn("Success, User is validated");
                user.setPassword(passwordEncoder.encode(newPassword));
                userDAO.save(user);
                return true;
            }

            log.warn("Passwords do NOT match");
            return false;

        } catch (Exception e) {
            log.error("Error updating password for user with ID " + id, e);
            return false;
        }
    }



    // TODO -> Works
    public void deleteNotEnabledUsersCreated7DaysAgo() {
    }




    // METHOD TO ADD USERS TO MONGO FOR TESTING
    @PostConstruct
    public void connectToMongo() {
        if (true) return;

        User user = User.builder().
                firstName("First name").
                lastName("last name").
                email("email").
                password("passwrd").
                phoneNumber("+13525755579").
                enabled(false).
                creationDate(new Date()).
                build();

        userDAO.insert(user);
    }


}