package com.Dash.Dashboard.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistrationRequest {

        @NotNull
        private String name;

        @NotNull
        @Pattern(regexp = "[A-Za-z0-9]{2,20}@[A-Za-z0-9]{2,20}\\.[A-Za-z]{3,10}")
        private String email;

        @NotNull
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,16}$")
        private String password;

}
