package com.Dash.Dashboard.Event;

import com.Dash.Dashboard.OAuth2.CustomAuthUser;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

@Getter
@Setter
public class OAuth2UserLoginEvent extends ApplicationEvent {

    private final CustomAuthUser user;

    public OAuth2UserLoginEvent(CustomAuthUser user) {
        super(user);
        this.user= user;
    }

}
