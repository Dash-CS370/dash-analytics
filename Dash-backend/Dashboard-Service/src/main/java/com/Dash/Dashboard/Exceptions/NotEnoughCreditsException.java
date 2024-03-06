package com.Dash.Dashboard.Exceptions;

public class NotEnoughCreditsException extends RuntimeException {

    public NotEnoughCreditsException() {
        super();
    }
    public NotEnoughCreditsException(String message) {
        super(message);
    }
    public NotEnoughCreditsException(String message, Throwable cause) {
        super(message, cause);
    }

    public NotEnoughCreditsException(Throwable throwable) {
        super(throwable);
    }

}
