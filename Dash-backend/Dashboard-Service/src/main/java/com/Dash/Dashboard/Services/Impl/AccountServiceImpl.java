package com.Dash.Dashboard.Services.Impl;

import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.OAuth2.CustomAuthUser;
import com.Dash.Dashboard.Services.AccountService;
import com.mongodb.client.result.DeleteResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

import static org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction.oauth2AuthorizedClient;


@Slf4j
@Service
public class AccountServiceImpl implements AccountService {

    private final WebClient webClient;

    private final MongoTemplate userDAO;

    private final PasswordEncoder passwordEncoder;


    @Autowired
    AccountServiceImpl(@Qualifier("userMongoTemplate") MongoTemplate userDAO, PasswordEncoder passwordEncoder, WebClient webClient) {
            this.userDAO = userDAO;
            this.webClient = webClient;
            this.passwordEncoder = passwordEncoder;
    }


    /**
     *
     * @param oauth2User
     * @return Optional containing User DTO
     */
    public Optional<User> pullUserProfile(OAuth2User oauth2User) {
        final String userEmail = (new CustomAuthUser(oauth2User)).getEmail();
        return Optional.ofNullable(userDAO.findOne(Query.query(Criteria.where("email").is(userEmail)), User.class));
    }



    public Optional<String> deleteUser(OAuth2AuthorizedClient client, OAuth2User oauth2User) {
        try {
            final String userEmail = (new CustomAuthUser(oauth2User)).getEmail();
            DeleteResult deleteResult = userDAO.remove(Query.query(Criteria.where("email").is(userEmail)), User.class);

            // MAKE HTTP request to Resource Server to delete users S3 dir
            final String deleteUserUrl = UriComponentsBuilder
                    .fromUriString("http://dash-resource-server:8081/api/v1/resources/user")
                    .queryParam("user-account", userEmail)
                    .buildAndExpand().toUriString();

            log.warn(deleteUserUrl);

            log.info("Deleted count: {}", deleteResult.getDeletedCount());

            return this.webClient.delete()
                    .uri(deleteUserUrl)
                    .attributes(oauth2AuthorizedClient(client))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Optional<String>>() {})
                    .block();

        } catch (Exception e) {
            log.error("Error deleting account belonging to" + oauth2User.getName(), e);
            return Optional.empty();
        }
    }


}