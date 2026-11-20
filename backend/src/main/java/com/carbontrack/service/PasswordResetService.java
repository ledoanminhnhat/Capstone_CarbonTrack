package com.carbontrack.service;

import com.carbontrack.model.PasswordResetToken;
import com.carbontrack.model.User;
import com.carbontrack.repository.PasswordResetTokenRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;

/**
 * Quên mật khẩu: gửi link có mã dùng 1 lần qua email, rồi đặt mật khẩu mới bằng mã đó.
 * - Không tiết lộ email có tồn tại hay không (luôn trả lời giống nhau).
 * - Chỉ lưu hash SHA-256 của mã; mã hết hạn sau 30 phút; mỗi user tối đa 1 mail / 60 giây.
 * - Tài khoản chỉ đăng nhập Google (chưa có mật khẩu) cũng dùng được để đặt mật khẩu lần đầu.
 */
@Service
public class PasswordResetService {

    static final int VALID_MINUTES = 30;
    private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(60);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepo;
    private final PasswordResetTokenRepository tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final String frontendUrl;

    public PasswordResetService(UserRepository userRepo, PasswordResetTokenRepository tokenRepo,
                                PasswordEncoder passwordEncoder, MailService mailService,
                                @Value("${app.frontend-url}") String frontendUrl) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    /** Gửi mail đặt lại mật khẩu nếu email có tài khoản. Không có thì im lặng bỏ qua. */
    public void requestReset(String rawEmail) {
        List<User> matches = userRepo.findAllByEmailIgnoreCase(rawEmail.trim().toLowerCase(Locale.ROOT));
        if (matches.size() != 1) return; // không có (hoặc trùng bất thường) → không làm gì
        User user = matches.get(0);

        // chặn spam: vừa gửi trong 60 giây thì bỏ qua
        boolean tooSoon = tokenRepo.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .map(t -> t.getCreatedAt().plus(RESEND_COOLDOWN).isAfter(Instant.now()))
                .orElse(false);
        if (tooSoon) return;

        tokenRepo.deleteByUserId(user.getId()); // chỉ giữ mã mới nhất
        String token = newToken();
        PasswordResetToken t = new PasswordResetToken();
        t.setUserId(user.getId());
        t.setTokenHash(sha256(token));
        t.setCreatedAt(Instant.now());
        t.setExpiresAt(Instant.now().plus(Duration.ofMinutes(VALID_MINUTES)));
        tokenRepo.save(t);

        String link = frontendUrl + "/reset-password?token=" + token;
        mailService.sendPasswordReset(user.getEmail(), user.getName(), link, VALID_MINUTES);
    }

    /** Kiểm tra mã còn dùng được không (để trang reset báo lỗi sớm). */
    public void validate(String token) {
        load(token);
    }

    /** Đặt mật khẩu mới bằng mã; dùng xong thì hủy mọi mã của user. */
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken t = load(token);
        User user = userRepo.findById(t.getUserId()).orElseThrow(this::invalid);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        tokenRepo.deleteByUserId(user.getId());
    }

    private PasswordResetToken load(String token) {
        if (token == null || token.isBlank()) throw invalid();
        PasswordResetToken t = tokenRepo.findByTokenHash(sha256(token)).orElseThrow(this::invalid);
        if (t.getExpiresAt().isBefore(Instant.now())) {
            tokenRepo.delete(t);
            throw invalid();
        }
        return t;
    }

    private ResponseStatusException invalid() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "This reset link is invalid or has expired. Please request a new one.");
    }

    /** 32 byte ngẫu nhiên, mã hóa base64url (an toàn để đặt trong URL). */
    private static String newToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String sha256(String s) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
