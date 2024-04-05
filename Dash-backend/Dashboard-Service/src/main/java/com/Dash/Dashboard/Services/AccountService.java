package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Entites.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;

public interface AccountService {

    Optional<User> pullUserProfile(OAuth2User oauth2User);

    Optional<String> deleteUserById(String id);

    boolean updateUserPassword(String id, String oldPassword, String newPassword);

}
