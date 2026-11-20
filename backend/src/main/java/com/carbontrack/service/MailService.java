package com.carbontrack.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.HtmlUtils;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Gửi email qua API của Brevo (HTTPS, cổng 443).
 * Không dùng SMTP vì Render gói free chặn kết nối ra cổng SMTP (25/465/587).
 * Chạy bất đồng bộ (@Async) để API trả lời ngay, và để thời gian phản hồi không để lộ email nào có tài khoản.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);
    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestClient http;
    private final String apiKey;
    private final String fromEmail;
    private final String fromName;

    public MailService(@Value("${brevo.api-key:}") String apiKey,
                       @Value("${app.mail.from}") String fromEmail,
                       @Value("${app.mail.from-name:CarbonTrack}") String fromName) {
        // HttpClient của JDK: giữ được nội dung lỗi của Brevo (vd 401 kèm lý do), có timeout để không treo vô hạn
        HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(client);
        factory.setReadTimeout(Duration.ofSeconds(15));
        this.http = RestClient.builder().requestFactory(factory).build();
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
        this.fromName = fromName;
    }

    /** Mail chứa link đặt lại mật khẩu. */
    @Async
    public void sendPasswordReset(String to, String name, String resetLink, int validMinutes) {
        send(to, name, "Reset your CarbonTrack password", resetHtml(name, resetLink, validMinutes));
    }

    private void send(String to, String toName, String subject, String html) {
        if (apiKey == null || apiKey.isBlank()) {
            log.error("Chưa cấu hình BREVO_API_KEY → không gửi được mail \"{}\"", subject);
            return;
        }
        Map<String, Object> body = Map.of(
                "sender", Map.of("email", fromEmail, "name", fromName),
                "to", List.of(Map.of("email", to, "name", toName == null || toName.isBlank() ? to : toName)),
                "subject", subject,
                "htmlContent", html);
        try {
            http.post().uri(BREVO_URL)
                    .header("api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            // không ghi link/token vào log
            String detail = e instanceof RestClientResponseException r ? r.getResponseBodyAsString() : "";
            log.error("Gửi mail \"{}\" qua Brevo thất bại: {} {}", subject, e.getMessage(), detail);
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
