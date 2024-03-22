package com.Dash.Dashboard.Services;

import com.Dash.Dashboard.Entites.User;

import java.util.Optional;

public interface AccountService {

    Optional<User> findUserById(String id);

    Optional<String> deleteUserById(String id);

    boolean updateUserPassword(String id, String oldPassword, String newPassword);

}
