package com.carbontrack.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Người dùng hệ thống. Ánh xạ tới collection "users" trong MongoDB.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements HasId {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)   // mỗi email chỉ đăng ký 1 lần
    private String email;

    private String password;  // LUÔN lưu dạng đã hash BCrypt, không bao giờ plaintext

    private String role;      // "USER" hoặc "ADMIN"

    private int points;       // điểm thưởng tích lũy từ challenge
}
