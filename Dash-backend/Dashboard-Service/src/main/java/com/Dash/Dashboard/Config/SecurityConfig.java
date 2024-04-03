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
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Autowired
    private OAuth2LoginSuccessHandler loginSuccessHandler;


    // TODO
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {

        http
            .csrf().disable()
            .cors(cors -> corsConfigurationSource())
            .authorizeRequests()
            .antMatchers("/auth/**").permitAll() // Public access
            .antMatchers("/swagger-ui.html").permitAll() // TODO - REMOVE IN THE FUTURE
            .antMatchers("/api/v1/password/**").permitAll()
            .antMatchers("/api/v1/user/**").authenticated()
            .antMatchers("/api/v1/dashboards/**").authenticated()
            .anyRequest().authenticated()
            .and()
            .oauth2Login(oauth2login -> oauth2login
                    .loginPage("http://127.0.0.1:3000/start")
                    .successHandler(loginSuccessHandler)
            )
            .oauth2Client(Customizer.withDefaults());

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
