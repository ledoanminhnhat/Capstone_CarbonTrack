package com.carbontrack.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Khuôn dữ liệu cho các API quản lý thông tin người dùng (Settings).
 */
public class UserDtos {

    // Thông tin trả về cho frontend
    public record UserProfile(
            String id,
            String name,
            String email,
            String role,
            int points,
            String avatarUrl,
            double yearlyGoalKg,
            boolean hasPassword // false = tài khoản tạo bằng Google, chưa đặt mật khẩu
    ) {}

    // Cài đặt Tracking: mục tiêu phát thải 1 năm (kg CO2)
    public record UpdateTrackingRequest(
            @DecimalMin(value = "100", message = "Yearly goal must be at least 100 kg")
            @DecimalMax(value = "100000", message = "Yearly goal must be at most 100,000 kg")
            double yearlyGoalKg
    ) {}

    // Đổi / xóa avatar (avatarUrl = null để xóa)
    public record UpdateAvatarRequest(String avatarUrl) {}

    // Đổi tên hiển thị
    public record UpdateProfileRequest(
            @NotBlank String name
    ) {}

    // Đổi mật khẩu (currentPassword bỏ trống được nếu tài khoản chưa có mật khẩu — đặt lần đầu)
    public record ChangePasswordRequest(
            String currentPassword,
            @NotBlank @Size(min = 6, message = "Mật khẩu mới tối thiểu 6 ký tự") String newPassword
    ) {}
}
