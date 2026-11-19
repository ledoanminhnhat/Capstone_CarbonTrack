package com.carbontrack.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    private String avatarUrl; // ảnh đại diện (Cloudinary), null = dùng chữ cái đầu tên

    private Instant createdAt; // ngày tạo tài khoản (account cũ có thể null)

    private Instant lastActiveAt; // lần cuối gọi API (PresenceService), dùng cho chấm "đang online"

    // Mục tiêu phát thải 1 năm (kg CO2). null = chưa đặt -> dùng DEFAULT_YEARLY_GOAL_KG
    private Double yearlyGoalKg;

    public static final double DEFAULT_YEARLY_GOAL_KG = 1800; // = 150 kg/tháng

    /** Mục tiêu năm thực tế (có mặc định cho account cũ). */
    public double effectiveYearlyGoalKg() {
        return yearlyGoalKg != null ? yearlyGoalKg : DEFAULT_YEARLY_GOAL_KG;
    }

    // Community: id những user mình đã ẩn (mute) -> không thấy bài/comment của họ
    private List<String> mutedUserIds = new ArrayList<>();
}
