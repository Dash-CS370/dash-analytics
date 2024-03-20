package com.Dash.Dashboard.Schedulers;

import com.Dash.Dashboard.Entites.User;
import com.Dash.Dashboard.Services.AccountService;
import com.mongodb.client.result.DeleteResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
@EnableScheduling
public class UserCleanUpScheduler {

    private final MongoTemplate userDAO;

    public UserCleanUpScheduler(@Qualifier("userMongoTemplate") MongoTemplate userDAO) {
        this.userDAO = userDAO;
    }

    @Scheduled(fixedRate = 1000L * 60 * 60 * 24 * 7) // FIXME
    public void deleteNotEnabledUsers() {
        final Instant SevenDaysAgo = Instant.now().minus(1, ChronoUnit.MINUTES);

        Query query = new Query(Criteria.where("enabled").is(false)
                .andOperator(Criteria.where("creationDate").lte(SevenDaysAgo)));

        DeleteResult result = userDAO.remove(query, User.class);

        if (!result.wasAcknowledged()) {
            log.info("Deletion operation did not go through: {}", result.getDeletedCount());
        }

        log.info("Deleted un-enabled users created 7 days ago: {}", result.getDeletedCount());
    }

}