package com.carbontrack.controller;

import com.carbontrack.dto.UserDtos.ChangePasswordRequest;
import com.carbontrack.dto.UserDtos.UpdateAvatarRequest;
import com.carbontrack.dto.UserDtos.UpdateProfileRequest;
import com.carbontrack.dto.UserDtos.UserProfile;
import com.carbontrack.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * API cho người dùng tự quản lý tài khoản của mình (trang Settings).
 * userId lấy từ token đăng nhập.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/users/me -> thông tin tài khoản hiện tại
    @GetMapping("/me")
    public UserProfile me(@AuthenticationPrincipal String userId) {
        return userService.getProfile(userId);
    }

    // PUT /api/users/me -> đổi tên hiển thị
    @PutMapping("/me")
    public UserProfile updateProfile(@AuthenticationPrincipal String userId,
                                     @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateName(userId, request.name());
    }

    // PUT /api/users/me/avatar -> đổi / xóa avatar
    @PutMapping("/me/avatar")
    public UserProfile updateAvatar(@AuthenticationPrincipal String userId,
                                    @RequestBody UpdateAvatarRequest request) {
        return userService.updateAvatar(userId, request.avatarUrl());
    }

    // PUT /api/users/me/password -> đổi mật khẩu
    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal String userId,
                                               @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userId, request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
    }
}
