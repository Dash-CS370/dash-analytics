package com.Dash.Authorization.Services;

import com.Dash.Authorization.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomerUserDetailsService implements UserDetailsService {

    private final MongoTemplate userDAO;

    @Autowired
    CustomerUserDetailsService(MongoTemplate userDAO) {
        this.userDAO = userDAO;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Query query = new Query(Criteria.where("email").is(username));
        User queriedUser = userDAO.findOne(query, User.class);
        if (queriedUser != null) {
            if (!queriedUser.isEnabled())
                throw new UsernameNotFoundException("Account has not been activated");
            else return queriedUser;
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
