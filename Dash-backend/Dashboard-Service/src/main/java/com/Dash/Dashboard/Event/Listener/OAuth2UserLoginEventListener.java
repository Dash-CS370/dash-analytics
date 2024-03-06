package com.Dash.Dashboard.Event.Listener;

import com.Dash.Dashboard.Entites.Role;
import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Entites.UserType;
import com.Dash.Dashboard.Event.OAuth2UserLoginEvent;
import com.Dash.Dashboard.Exceptions.UserAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
public class OAuth2UserLoginEventListener implements ApplicationListener<OAuth2UserLoginEvent> {

    @Value("${spring.application.default-start-credits}")
    private int DEFAULT_STARTING_CREDIT_AMOUNT;

    private final MongoTemplate userDAO;

    @Autowired
    public OAuth2UserLoginEventListener(@Qualifier("userMongoTemplate") MongoTemplate userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public void onApplicationEvent(OAuth2UserLoginEvent event) throws UserAlreadyExistsException {

        final OidcUser oidcUser = event.getUser();

        Optional<User> user = Optional.ofNullable(
                userDAO.findOne(new Query(Criteria.where("email").is(oidcUser.getEmail())), User.class)
        );

        if (user.isPresent() && user.get().getUserType() == UserType.DASH)
            throw new UserAlreadyExistsException("In-House account is already associated with this email " + oidcUser.getEmail());

        else if (user.isEmpty()) {
            userDAO.insert(
                User.builder().
                    email(oidcUser.getEmail()).enabled(true).
                    firstName(oidcUser.getGivenName()).
                    credits(DEFAULT_STARTING_CREDIT_AMOUNT).
                    userType(UserType.THIRD_PARTY).
                    role(Role.USER)
                .build()
            );
        }
    }


}
