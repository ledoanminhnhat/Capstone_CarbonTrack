package com.carbontrack.controller;

import com.carbontrack.dto.AdminDtos.AdminUserView;
import com.carbontrack.dto.AdminDtos.UpdateRoleRequest;
import com.carbontrack.dto.ChallengeDtos.CreateChallengeRequest;
import com.carbontrack.model.Challenge;
import com.carbontrack.service.AdminService;
import com.carbontrack.service.ChallengeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Khu quản trị. Toàn bộ /api/admin/** chỉ ADMIN mới vào được (cấu hình ở SecurityConfig).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ChallengeService challengeService;

    public AdminController(AdminService adminService, ChallengeService challengeService) {
        this.adminService = adminService;
        this.challengeService = challengeService;
    }

    // GET /api/admin/users -> danh sách user
    @GetMapping("/users")
    public List<AdminUserView> listUsers() {
        return adminService.listUsers();
    }

    // PUT /api/admin/users/{id}/role -> đổi role
    @PutMapping("/users/{id}/role")
    public AdminUserView changeRole(@AuthenticationPrincipal String callerId,
                                    @PathVariable String id,
                                    @Valid @RequestBody UpdateRoleRequest request) {
        return adminService.changeRole(callerId, id, request.role());
    }

    // DELETE /api/admin/users/{id} -> xóa user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal String callerId,
                                           @PathVariable String id) {
        adminService.deleteUser(callerId, id);
        return ResponseEntity.noContent().build();
    }

    // ===== Quản lý Challenge =====

    // GET /api/admin/challenges -> tất cả challenge (kể cả inactive)
    @GetMapping("/challenges")
    public List<Challenge> listChallenges() {
        return challengeService.listAll();
    }

    // POST /api/admin/challenges -> tạo challenge mới
    @PostMapping("/challenges")
    public Challenge createChallenge(@Valid @RequestBody CreateChallengeRequest request) {
        return challengeService.create(request);
    }

    // DELETE /api/admin/challenges/{id} -> xóa challenge
    @DeleteMapping("/challenges/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable String id) {
        challengeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
