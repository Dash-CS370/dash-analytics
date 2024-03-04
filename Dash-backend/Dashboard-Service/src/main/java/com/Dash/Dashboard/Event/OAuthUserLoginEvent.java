package com.Dash.Dashboard.Event;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

@Getter
@Setter
public class OAuthUserLoginEvent extends ApplicationEvent {

    private final OidcUser user;

    public OAuthUserLoginEvent(OidcUser user) {
        super(user);
        this.user= user;
    }

}
