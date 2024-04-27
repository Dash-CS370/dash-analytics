package com.Dash.Dashboard.Events.Listener;

import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Entites.VerificationToken;
import com.Dash.Dashboard.Events.UserCreditCheckEvent;
import com.Dash.Dashboard.Exceptions.NotEnoughCreditsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Optional;

@Component
public class UserCreditCheckEventListener implements  ApplicationListener<UserCreditCheckEvent> {

    private final static Integer PROJECT_CREATION_COST = 10;

    private final MongoTemplate userDAO;

    @Autowired
    public UserCreditCheckEventListener(@Qualifier("userMongoTemplate") MongoTemplate userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public void onApplicationEvent(UserCreditCheckEvent event) throws NotEnoughCreditsException {
        final String userAccount = event.getUserAccount();

        final Query query = new Query(Criteria.where("email").is(userAccount));

        Optional<User> queriedUser = Optional.ofNullable(userDAO.findOne(query, User.class));

        queriedUser.ifPresent((user) -> {
            if (!user.hasSufficientCredits()) throw new NotEnoughCreditsException("User has insufficient credits...");
            else {
                final Update update = new Update().set("credits", user.getCredits() - PROJECT_CREATION_COST);
                userDAO.updateFirst(query, update, User.class);
            }
        });
    }
}
