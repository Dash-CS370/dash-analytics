package com.Dash.Dashboard.Event;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
public class UserCreditCheckEvent extends ApplicationEvent {

    private final String userId;

    public UserCreditCheckEvent(String userId) {
        super(userId);
        this.userId = userId;
    }
}
