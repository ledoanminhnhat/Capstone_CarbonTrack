package com.carbontrack.controller;

import com.carbontrack.dto.ChallengeDtos.ChallengeView;
import com.carbontrack.service.ChallengeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    // GET /api/challenges -> danh sách challenge + trạng thái của tôi
    @GetMapping
    public List<ChallengeView> list(@AuthenticationPrincipal String userId) {
        return challengeService.listForUser(userId);
    }

    // POST /api/challenges/{id}/join -> tham gia
    @PostMapping("/{id}/join")
    public ResponseEntity<Void> join(@AuthenticationPrincipal String userId,
                                     @PathVariable String id) {
        challengeService.join(userId, id);
        return ResponseEntity.noContent().build();
    }
}
