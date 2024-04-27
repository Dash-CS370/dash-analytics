package com.Dash.Dashboard.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;


@Configuration
public class MongoConfig {

    @Primary
    @Bean(name = "userMongoTemplate")
    public MongoTemplate userMongoTemplate(MongoDatabaseFactory databaseFactory) {
        return new MongoTemplate(databaseFactory);
    }

    @Bean(name = "verificationMongoTemplate")
    public MongoTemplate verificationTokenMongoTemplate(MongoDatabaseFactory databaseFactory) {
        return new MongoTemplate(databaseFactory);
    }

    @Bean(name = "passwordResetMongoTemplate")
    public MongoTemplate passwordResetTokenMongoTemplate(MongoDatabaseFactory databaseFactory) {
        return new MongoTemplate(databaseFactory);
    }

}