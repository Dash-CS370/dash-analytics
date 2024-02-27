package com.Dash.Dashboard.Entites;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Calendar;
import java.util.Date;


@Data
@NoArgsConstructor
@Document(collection = "VerificationTokens")
public class VerificationToken {

    private static final int EXPIRATION_TIME = 5;

    @Id
    private String id;

    @NotNull
    @NotEmpty
    private String activationKey;

    private Date expirationDate;

    @DBRef
    private User user; // LINK to USER ENTITY

    public VerificationToken(User user, String activationKey) {
        this.activationKey = activationKey;
        this.expirationDate = calculateExpirationDate();
        this.user = user;
    }

    private Date calculateExpirationDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, VerificationToken.EXPIRATION_TIME);
        return new Date(calendar.getTime().getTime());
    }

}
