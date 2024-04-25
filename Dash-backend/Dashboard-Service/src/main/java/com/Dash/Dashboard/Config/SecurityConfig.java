package com.Dash.Dashboard.Config;

import com.Dash.Dashboard.OAuth2.OAuth2LoginSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private OAuth2LoginSuccessHandler loginSuccessHandler;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().disable()
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/auth/**").permitAll() // Public access
            .antMatchers("/api/v1/password/**").permitAll()
            .antMatchers("/api/v1/user/**").authenticated()
            .antMatchers("/api/v1/dashboards/**").authenticated()
            .anyRequest().authenticated()
            .and()
            .oauth2Login(oauth2login -> oauth2login
                    .loginPage("https://dash-analytics.solutions/start")
                    .successHandler(loginSuccessHandler)
            )
            .oauth2Client(Customizer.withDefaults())
            .logout().disable();

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
