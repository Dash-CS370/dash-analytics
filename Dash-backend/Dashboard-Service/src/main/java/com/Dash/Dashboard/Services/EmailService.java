package com.Dash.Dashboard.Services;

import freemarker.template.TemplateException;
import javax.mail.MessagingException;
import java.io.IOException;
import java.util.Map;

public interface EmailService {

    void sendEmail(String email, Map<String, Object> model, String templateName) throws MessagingException, IOException, TemplateException;

    void sendEmailWithRetries(String email, Map<String, Object> model, String templateName, Integer maxRetryCount) throws InterruptedException;

}
