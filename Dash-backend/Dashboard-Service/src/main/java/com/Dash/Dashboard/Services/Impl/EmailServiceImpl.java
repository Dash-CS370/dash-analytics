package com.Dash.Dashboard.Services.Impl;

import com.Dash.Dashboard.Services.EmailService;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    private final Configuration freemarkerConfig;

    @Autowired
    EmailServiceImpl(JavaMailSender mailSender, Configuration freemarkerConfig) {
        this.mailSender = mailSender;
        this.freemarkerConfig = freemarkerConfig;
    }

    public void sendEmail(String email, Map<String, Object> model, String templateName) throws MessagingException, IOException, TemplateException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

        // Set values from the model
        Template t = freemarkerConfig.getTemplate(templateName);
        String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);

        helper.setTo(email); // recipient
        helper.setText(html, true);
        helper.setSubject("Email Verification");
        helper.setFrom("no-reply@dash-analytics.com");

        mailSender.send(message);
        log.info("Activation email sent asynchronously to: " + email);
    }


    public void sendEmailWithRetries(String email, Map<String, Object> model, String templateName, Integer maxRetryCount) throws InterruptedException {
        try {
            sendEmail(email, model, templateName);
        } catch (MessagingException | IOException | TemplateException e) {
            if (maxRetryCount > 0) {

                Thread.sleep(1000 * 20); // TODO

                sendEmailWithRetries(email, model, templateName, maxRetryCount - 1);
                log.error("Attempting to send activation email again to : " + email, e);
            } else {
                log.error("Error sending activation email to: " + email, e);
            }
        } catch (Exception e) {
            log.error("SERIOUS ERR : " + email, e);
        }
    }


}
