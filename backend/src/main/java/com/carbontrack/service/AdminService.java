package com.carbontrack.service;

import com.carbontrack.dto.AdminDtos.AdminUserView;
import com.carbontrack.model.User;
import com.carbontrack.repository.ActivityRepository;
import com.carbontrack.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Service
public class AdminService {

    private static final Set<String> VALID_ROLES = Set.of("USER", "ADMIN");

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    private final CommunityService communityService;

    public AdminService(UserRepository userRepository, ActivityRepository activityRepository,
                        CommunityService communityService) {
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
        this.communityService = communityService;
    }

    /** Danh sách tất cả user, kèm số hoạt động đã ghi. */
    public List<AdminUserView> listUsers() {
        return userRepository.findAll().stream()
                .map(this::toView)
                .toList();
    }

    /** Đổi role của 1 user (không cho admin tự đổi role chính mình). */
    public AdminUserView changeRole(String callerId, String targetId, String role) {
        if (!VALID_ROLES.contains(role)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role không hợp lệ");
        }
        if (callerId.equals(targetId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể tự đổi role của chính mình");
        }
        User target = userRepository.findById(targetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        target.setRole(role);
        User saved = userRepository.save(target);
        return toView(saved);
    }

    /** Xóa 1 user + toàn bộ hoạt động của họ (không cho tự xóa chính mình). */
    public void deleteUser(String callerId, String targetId) {
        if (callerId.equals(targetId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể tự xóa chính mình");
        }
        if (!userRepository.existsById(targetId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        activityRepository.deleteByUserId(targetId);
        communityService.deleteAllOfUser(targetId); // bài viết, comment, like, mute
        userRepository.deleteById(targetId);
    }

    private AdminUserView toView(User u) {
        return new AdminUserView(u.getId(), u.getName(), u.getEmail(), u.getRole(),
                activityRepository.countByUserId(u.getId()),
                u.getAvatarUrl(), u.getPoints(), joinedAt(u), u.getLastActiveAt());
    }

    /**
     * Ngày tham gia: dùng createdAt; account cũ không có thì thử suy ra từ id dạng
     * Mongo ObjectId (8 ký tự hex đầu = thời điểm tạo, tính bằng giây). Id UUID thì trả null.
     */
    private static Instant joinedAt(User u) {
        if (u.getCreatedAt() != null) return u.getCreatedAt();
        String id = u.getId();
        if (id != null && id.matches("[0-9a-fA-F]{24}")) {
            return Instant.ofEpochSecond(Long.parseLong(id.substring(0, 8), 16));
        }
        return null;
    }
}
