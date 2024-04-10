package com.Dash.Dashboard.OAuth2;

import com.Dash.Dashboard.Events.Listener.OAuth2UserLoginEventListener;
import com.Dash.Dashboard.Events.OAuth2UserLoginEvent;
import com.Dash.Dashboard.Exceptions.UserAlreadyExistsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Slf4j
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final static String DEFAULT_SUCCESS_URL = "http://18.189.41.235:3000/dashboards";

    private final OAuth2UserLoginEventListener thirdPartyLoginEventListener;

    OAuth2LoginSuccessHandler(OAuth2UserLoginEventListener thirdPartyLoginEventListener) {
        this.thirdPartyLoginEventListener = thirdPartyLoginEventListener;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException, UserAlreadyExistsException {

        assert authentication.getPrincipal() instanceof OAuth2User;

        final CustomAuthUser authUser = new CustomAuthUser((OAuth2User) authentication.getPrincipal());

        if (authUser.wasIssuedExternally()) {
            thirdPartyLoginEventListener.onApplicationEvent(new OAuth2UserLoginEvent(authUser));
        }

        log.warn("Redirecting to DEFAULT_SUCCESS_URL");

        response.sendRedirect(DEFAULT_SUCCESS_URL);

        super.onAuthenticationSuccess(request, response, authentication);
    }


}
