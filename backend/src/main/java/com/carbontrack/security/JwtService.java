package com.carbontrack.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * Lo việc tạo JWT token (khi login) và đọc/kiểm tra token (mỗi request).
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey key;

    // Tạo khóa một lần lúc khởi động. Chấp nhận cả base64 thường lẫn base64 URL-safe
    // (dấu - và _), và bỏ khoảng trắng thừa khi dán biến môi trường.
    @PostConstruct
    void init() {
        String normalized = secret.trim().replaceAll("\\s", "")
                .replace('-', '+').replace('_', '/');
        key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(normalized));
        log.info("JWT secret loaded: length={}, urlSafeChars={}",
                normalized.length(), !normalized.equals(secret));
    }

    private SecretKey getKey() {
        return key;
    }

    /** Tạo token chứa email (subject), kèm role và userId. */
    public String generateToken(String email, String role, String userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(email)
                .claims(Map.of("role", role, "userId", userId))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }

    public boolean isValid(String token) {
        try {
            return extractClaim(token, Claims::getExpiration).after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }
}
