package com.Dash.Dashboard.OAuth2;

import com.Dash.Dashboard.Event.Listener.OAuth2UserLoginEventListener;
import com.Dash.Dashboard.Event.OAuth2UserLoginEvent;
import com.Dash.Dashboard.Exceptions.UserAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.Dash.Dashboard.Services.DashboardService.THIRD_PARTY_SERVICES;


@Slf4j
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2UserLoginEventListener thirdPartyLoginEventListener;

    OAuth2LoginSuccessHandler(OAuth2UserLoginEventListener thirdPartyLoginEventListener) {
        this.thirdPartyLoginEventListener = thirdPartyLoginEventListener;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException, UserAlreadyExistsException {

        assert authentication.getPrincipal() instanceof OAuth2User;

        final OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        if (oauth2User instanceof OidcUser user && user.getIssuer().getHost().matches(THIRD_PARTY_SERVICES)) {
            thirdPartyLoginEventListener.onApplicationEvent(new OAuth2UserLoginEvent(user));
        }

        super.onAuthenticationSuccess(request, response, authentication);
    }

}
