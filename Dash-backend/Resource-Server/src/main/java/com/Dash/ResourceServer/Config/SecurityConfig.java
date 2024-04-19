package com.Dash.ResourceServer.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeRequests().mvcMatchers("/api/v1/**")
                .access("hasAuthority('SCOPE_api.read')")
                .and()
                .oauth2ResourceServer()
                .jwt();

        return http.build();
    }

}
