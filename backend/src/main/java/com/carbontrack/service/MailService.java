package com.carbontrack.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

/**
 * Gửi email qua SMTP (Gmail). Chạy bất đồng bộ (@Async) để API trả lời ngay,
 * và để thời gian phản hồi không để lộ email nào có tài khoản.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;
    private final String from;

    public MailService(JavaMailSender mailSender, @Value("${spring.mail.username:}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    /** Mail chứa link đặt lại mật khẩu. */
    @Async
    public void sendPasswordReset(String to, String name, String resetLink, int validMinutes) {
        if (from == null || from.isBlank()) {
            log.error("Chưa cấu hình spring.mail.username/password → không gửi được mail đặt lại mật khẩu");
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, false, "UTF-8");
            h.setFrom(from, "CarbonTrack");
            h.setTo(to);
            h.setSubject("Reset your CarbonTrack password");
            h.setText(resetHtml(name, resetLink, validMinutes), true);
            mailSender.send(msg);
        } catch (Exception e) {
            // không ghi link/token vào log
            log.error("Gửi mail đặt lại mật khẩu thất bại: {}", e.getMessage());
        }
    }

    private static String resetHtml(String name, String link, int minutes) {
        String safeName = HtmlUtils.htmlEscape(name == null || name.isBlank() ? "there" : name);
        String safeLink = HtmlUtils.htmlEscape(link);
        return """
                <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1f2937">
                  <h2 style="margin:0 0 16px;color:#059669">CarbonTrack</h2>
                  <p>Hi %s,</p>
                  <p>We received a request to reset your password. Click the button below to choose a new one.</p>
                  <p style="margin:28px 0">
                    <a href="%s" style="background:#10b981;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:bold;display:inline-block">Reset password</a>
                  </p>
                  <p style="color:#6b7280;font-size:14px">This link expires in %d minutes and can only be used once.</p>
                  <p style="color:#6b7280;font-size:14px">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
                  <p style="color:#9ca3af;font-size:12px;word-break:break-all">If the button doesn't work, copy this link into your browser:<br>%s</p>
                </div>
                """.formatted(safeName, safeLink, minutes, safeLink);
    }
}
