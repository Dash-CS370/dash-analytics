package com.Dash.Dashboard.Event.Listener;

import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Event.UserCreditCheckEvent;
import com.Dash.Dashboard.Exceptions.NotEnoughCreditsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserCreditCheckEventListener implements  ApplicationListener<UserCreditCheckEvent> {

    private final MongoTemplate userDAO;

    @Autowired
    public UserCreditCheckEventListener(@Qualifier("userMongoTemplate") MongoTemplate userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public void onApplicationEvent(UserCreditCheckEvent event) throws NotEnoughCreditsException {
        final String userAccount = event.getUserAccount();

        Optional<User> queriedUser = Optional.ofNullable(
                userDAO.findOne(new Query(Criteria.where("email").is(userAccount)), User.class)
        );

        queriedUser.ifPresent((user) -> {
            if (!user.hasSufficientCredits()) throw new NotEnoughCreditsException("User has insufficient credits...");
        });
    }
}
