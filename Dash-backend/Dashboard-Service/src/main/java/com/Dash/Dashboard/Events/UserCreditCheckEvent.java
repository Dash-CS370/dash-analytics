package com.Dash.Dashboard.Events;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class UserCreditCheckEvent extends ApplicationEvent {

    private final String userAccount;

    public UserCreditCheckEvent(String userAccount) {
        super(userAccount);
        this.userAccount = userAccount;
    }
}
