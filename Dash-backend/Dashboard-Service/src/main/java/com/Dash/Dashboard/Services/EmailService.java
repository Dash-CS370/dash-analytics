package com.Dash.Dashboard.Services;

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
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Configuration freemarkerConfig;


    public void sendEmail(String email, Map<String, Object> model, String templateName) throws MessagingException, IOException, TemplateException {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            // Set values from the model
            String path = "/Users/wenyuanhuizi/Desktop/dash/Dash-backend/Dashboard-Service/src/main/resources/templates/";

            freemarkerConfig.setDirectoryForTemplateLoading(new File(path));
            Template t = freemarkerConfig.getTemplate(templateName);
            String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);

            helper.setTo(email); // recipient
            helper.setText(html, true);
            helper.setSubject("Email Verification");
            helper.setFrom("noreply@dashAnalytics.com");

            mailSender.send(message);
            log.info("Activation email sent asynchronously to: " + email);
    }

    public void sendEmailWithRetries(String email, Map<String, Object> model, String templateName, Integer maxRetryCount) {
        try {
            sendEmail(email, model, templateName);
        } catch (MessagingException | IOException | TemplateException e) {
            if (maxRetryCount > 0) {
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
