package com.Dash.Dashboard.Schedulers;

import com.Dash.Dashboard.Entites.User;
import com.mongodb.client.result.DeleteResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public UserCleanUpScheduler(@Qualifier("userMongoTemplate") MongoTemplate userDAO) {
        this.userDAO = userDAO;
    }


    /**
     * Scheduled job that deletes users who have not been enabled.
     *
     * This job runs every 7 days and removes users who were created at
     * least 7 days ago and have not activated their accounts.
     */
    @Scheduled(fixedRate= 1000 * 60 * 60 * 24 * 7)
    public void deleteNotEnabledUsers() {
        final Instant SevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);

        Query query = new Query(Criteria.where("enabled").is(false)
                .andOperator(Criteria.where("creationDate").lte(SevenDaysAgo)));

        DeleteResult result = userDAO.remove(query, User.class);

        if (!result.wasAcknowledged()) {
            log.info("Deletion operation did not go through: {}", result.getDeletedCount());
        }

        log.info("Deleted un-enabled users created 7 days ago: {}", result.getDeletedCount());
    }

}