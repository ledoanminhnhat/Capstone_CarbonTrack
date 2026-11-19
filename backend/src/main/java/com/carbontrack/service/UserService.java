package com.carbontrack.service;

import com.carbontrack.dto.UserDtos.UserProfile;
import com.carbontrack.model.User;
import com.carbontrack.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final UploadService uploadService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       UploadService uploadService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.uploadService = uploadService;
    }

    private User findOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserProfile getProfile(String userId) {
        return toProfile(findOrThrow(userId));
    }

    public UserProfile updateName(String userId, String name) {
        User user = findOrThrow(userId);
        user.setName(name);
        return toProfile(userRepository.save(user));
    }

    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = findOrThrow(userId);

        if (user.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tài khoản này chưa đặt mật khẩu");
        }
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không đúng");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /** Đặt avatar mới (phải là ảnh trong folder avatars của mình) hoặc null để xóa. */
    public UserProfile updateAvatar(String userId, String avatarUrl) {
        if (avatarUrl != null && !uploadService.isOwnImage(avatarUrl, UploadService.Kind.AVATAR)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid avatar URL");
        }
        User user = findOrThrow(userId);
        user.setAvatarUrl(avatarUrl);
        return toProfile(userRepository.save(user));
    }

    private UserProfile toProfile(User u) {
        return new UserProfile(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getPoints(),
                u.getAvatarUrl());
    }
}
