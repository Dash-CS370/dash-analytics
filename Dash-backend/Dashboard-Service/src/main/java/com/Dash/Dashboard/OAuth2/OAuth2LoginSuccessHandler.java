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

    private final static String DEFAULT_SUCCESS_URL = "https://dash-analytics.solutions/dashboards";

    private final OAuth2UserLoginEventListener thirdPartyLoginEventListener;

    OAuth2LoginSuccessHandler(OAuth2UserLoginEventListener thirdPartyLoginEventListener) {
        this.thirdPartyLoginEventListener = thirdPartyLoginEventListener;
    }


    /**
     * This method is called when authentication succeeds, allowing for additional actions
     * such as event triggering and redirection to a default success URL, persisting the authenticated session.
     *
     * @param request The HTTP request during authentication.
     * @param response The HTTP response for redirection.
     * @param authentication The successful authentication object.
     * @throws ServletException If an error occurs during the servlet operation.
     * @throws IOException If an I/O error occurs during redirection.
     * @throws UserAlreadyExistsException If the user's account email is already associated with another account
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException, UserAlreadyExistsException {

        assert authentication.getPrincipal() instanceof OAuth2User;

        final CustomAuthUser authUser = new CustomAuthUser((OAuth2User) authentication.getPrincipal());

        if (authUser.wasIssuedExternally()) {
            thirdPartyLoginEventListener.onApplicationEvent(new OAuth2UserLoginEvent(authUser));
        }

        log.warn("Redirecting to " + DEFAULT_SUCCESS_URL);

        response.sendRedirect(DEFAULT_SUCCESS_URL);

        super.onAuthenticationSuccess(request, response, authentication);
    }


}
