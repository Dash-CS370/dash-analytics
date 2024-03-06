package com.Dash.Dashboard.Config;

import com.Dash.Dashboard.OAuth2.OAuth2LoginSuccessHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Autowired
    private OAuth2LoginSuccessHandler loginSuccessHandler;


    // TODO
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable()
            .authorizeRequests()
            .antMatchers("/auth/**").permitAll() // Public access
            .antMatchers("/swagger-ui.html").permitAll() // TODO - REMOVE IN THE FUTURE
            .antMatchers("/my-dashboard/**").authenticated() // Secured endpoints for authenticated users only

            .and()
            .oauth2Login(oauth2login -> oauth2login
                    //.loginPage("http://localhost:3000") // TODO - HOME PAGE -> GUCCI
                    .successHandler(loginSuccessHandler)
                    .defaultSuccessUrl("/my-dashboard") // Where to redirect after successful authentication
            )
            .oauth2Client(Customizer.withDefaults());
            /*
            // TODO => not way to end userSession???
            .logout(logout -> logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/")
                    .clearAuthentication(true)
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
            );*/

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
