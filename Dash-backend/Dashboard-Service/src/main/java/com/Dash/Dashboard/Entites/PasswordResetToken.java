package com.Dash.Dashboard.Entites;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Calendar;
import java.util.Date;


@Data
@Document(collection = "PasswordResetTokens")
public class PasswordResetToken {

    private static final int EXPIRATION_TIME = 5; // Minutes

    @Id
    private String id;

    @NotNull
    @NotEmpty
    private String resetPasswordKey;

    private Date expirationDate;

    @DBRef
    private User user; // LINK to USER ENTITY

    public PasswordResetToken(User user, String resetPasswordKey) {
        this.resetPasswordKey = resetPasswordKey;
        this.expirationDate = calculateExpirationDate();
        this.user = user;
    }

    private Date calculateExpirationDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, PasswordResetToken.EXPIRATION_TIME);
        return new Date(calendar.getTime().getTime());
    }

}
