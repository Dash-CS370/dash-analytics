package com.Dash.Dashboard.Events.Listener;

import com.Dash.Dashboard.Entites.Role;
import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Entites.UserType;
import com.Dash.Dashboard.Events.OAuth2UserLoginEvent;
import com.Dash.Dashboard.Exceptions.UserAlreadyExistsException;
import com.Dash.Dashboard.OAuth2.CustomAuthUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
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

        final CustomAuthUser user = event.getUser();

        Optional<User> queriedUser = Optional.ofNullable(
                userDAO.findOne(new Query(Criteria.where("email").is(user.getEmail())), User.class)
        );

        if (queriedUser.isPresent() && queriedUser.get().getUserType() == UserType.DASH)
            throw new UserAlreadyExistsException("A Dash account is already associated with this email " + user.getEmail());

        else if (queriedUser.isEmpty()) {
            final Calendar calendar = Calendar.getInstance();
            calendar.setTimeInMillis(new Date().getTime());

            userDAO.insert(
                User.builder()
                    .email(user.getEmail()).enabled(true)
                    .name(user.getName())
                    .credits(DEFAULT_STARTING_CREDIT_AMOUNT)
                    .userType(UserType.THIRD_PARTY)
                    .creationDate(new Date(calendar.getTime().getTime()))
                    .role(Role.USER)
                .build()
            );
        }
    }


}
