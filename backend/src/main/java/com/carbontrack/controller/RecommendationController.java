package com.carbontrack.controller;

import com.carbontrack.dto.RecommendationDtos.ApplyResponse;
import com.carbontrack.dto.RecommendationDtos.RecommendationResponse;
import com.carbontrack.service.RecommendationService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    // GET /api/recommendations?month=MM/yyyy  (bỏ month = toàn bộ thời gian)
    @GetMapping
    public RecommendationResponse get(@AuthenticationPrincipal String userId,
                                      @RequestParam(required = false) String month) {
        return recommendationService.forUser(userId, month);
    }

    // POST /api/recommendations/{ruleId}/apply -> biến gợi ý thành challenge và tham gia
    @PostMapping("/{ruleId}/apply")
    public ApplyResponse apply(@AuthenticationPrincipal String userId,
                               @PathVariable String ruleId) {
        return recommendationService.apply(userId, ruleId);
    }
}
