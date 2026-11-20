package com.carbontrack.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Mã đặt lại mật khẩu (quên mật khẩu). Chỉ lưu HASH SHA-256 của mã, mã thật chỉ nằm trong link gửi qua mail.
 * Dùng 1 lần: đổi mật khẩu xong thì xóa mọi mã của user đó.
 */
@Data
@NoArgsConstructor
@Document(collection = "password_reset_tokens")
public class PasswordResetToken implements HasId {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed(unique = true)
    private String tokenHash;

    private Instant createdAt;
    private Instant expiresAt;
}
