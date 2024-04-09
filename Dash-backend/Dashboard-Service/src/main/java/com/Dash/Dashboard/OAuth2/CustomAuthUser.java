package com.Dash.Dashboard.OAuth2;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomAuthUser implements OAuth2User {

    public final static String THIRD_PARTY_SERVICES = "(.*microsoft.*)|(.*google.*)";

    private final OidcUser oidcUser;

    private final OAuth2User oauth2User;

    public CustomAuthUser(OAuth2User oauth2User) {
        assert oauth2User instanceof OidcUser;
        this.oauth2User = oauth2User;
        this.oidcUser = (OidcUser) oauth2User;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    public boolean wasIssuedExternally()  {
        return oidcUser.getIssuer().getHost().matches(THIRD_PARTY_SERVICES);
    }

    @Override
    public String getName() {
        if (wasIssuedExternally()) {
            return oidcUser.getGivenName();
        } else return oidcUser.getName();
    }

    public String getEmail() {
        return oidcUser.getEmail() == null ? oidcUser.getAttributes().get("sub").toString() : oidcUser.getEmail();
    }

}
