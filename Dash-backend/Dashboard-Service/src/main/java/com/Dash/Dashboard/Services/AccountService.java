package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Entites.User;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;

public interface AccountService {

    Optional<User> pullUserProfile(OAuth2User oauth2User);

    boolean updateUserPassword(OAuth2User oauth2User, String oldPassword, String newPassword);

    Optional<String> deleteUserById(OAuth2AuthorizedClient client, OAuth2User oauth2User);
}
