package com.carbontrack.controller;

import com.carbontrack.dto.ActivityRequest;
import com.carbontrack.model.Activity;
import com.carbontrack.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API cho Activity. Mọi endpoint yêu cầu đăng nhập; userId lấy từ token.
 * Base path: /api/activities
 */
@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService service;

    public ActivityController(ActivityService service) {
        this.service = service;
    }

    // GET /api/activities -> các hoạt động của CHÍNH người đang đăng nhập
    @GetMapping
    public List<Activity> getMine(@AuthenticationPrincipal String userId) {
        return service.getByUserId(userId);
    }

    // POST /api/activities -> ghi hoạt động mới (backend tự tính CO2)
    @PostMapping
    public Activity log(@AuthenticationPrincipal String userId,
                        @Valid @RequestBody ActivityRequest request) {
        return service.log(userId, request);
    }

    // DELETE /api/activities/{id} -> xóa (chỉ của chính mình)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal String userId,
                                       @PathVariable String id) {
        service.delete(userId, id);
        return ResponseEntity.noContent().build();
    }
}
