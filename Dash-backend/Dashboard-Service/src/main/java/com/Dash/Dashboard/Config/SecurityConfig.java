package com.Dash.Dashboard.Config;

import com.Dash.Dashboard.OAuth2.OAuth2LoginSuccessHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Autowired
    private OAuth2LoginSuccessHandler loginSuccessHandler;


    // TODO
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf().disable()
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("http://127.0.0.1:3000"));
                configuration.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
                configuration.setAllowCredentials(true);
                return configuration;
            }))
            .authorizeRequests()
            .antMatchers("/auth/**").permitAll() // Public access
            .antMatchers("/swagger-ui.html").permitAll() // TODO - REMOVE IN THE FUTURE
            .antMatchers("/my-dashboard/**").authenticated() // Secured endpoints for authenticated users only
            .anyRequest().authenticated()
            .and()
            .oauth2Login(oauth2login -> oauth2login
                    .loginPage("http://127.0.0.1:3000/signin")
                    .successHandler(loginSuccessHandler)
            )
            .oauth2Client(Customizer.withDefaults());
         /*
            .sessionManagement(sessionManagement ->
                sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Create session if required
                        .sessionFixation().newSession() // Protect against session fixation
            );
             */

        return http.build();
    }




    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
