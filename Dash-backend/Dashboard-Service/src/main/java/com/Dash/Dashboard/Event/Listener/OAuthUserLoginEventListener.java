package com.Dash.Dashboard.Event.Listener;

import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Event.OAuthUserLoginEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
public class OAuthUserLoginEventListener implements ApplicationListener<OAuthUserLoginEvent> {


    private final MongoTemplate userDAO;

    @Autowired
    public OAuthUserLoginEventListener(@Qualifier("userMongoTemplate") MongoTemplate userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public void onApplicationEvent(OAuthUserLoginEvent event) {
        // User identification will be there unique email
        final OidcUser oidcUser = event.getUser();

        Optional<User> user = Optional.ofNullable(
                userDAO.findOne(new Query(Criteria.where("email").is(oidcUser.getEmail())), User.class)
        );



    }
}
