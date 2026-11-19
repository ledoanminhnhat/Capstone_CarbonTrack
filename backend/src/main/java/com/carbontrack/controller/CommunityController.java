package com.carbontrack.controller;

import com.carbontrack.dto.CommunityDtos.*;
import com.carbontrack.service.CommunityService;
import com.carbontrack.service.UploadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommunityController {

    private final CommunityService community;
    private final UploadService uploads;

    public CommunityController(CommunityService community, UploadService uploads) {
        this.community = community;
        this.uploads = uploads;
    }

    // ----- Posts -----
    @GetMapping("/posts")
    public FeedPage feed(@AuthenticationPrincipal String userId,
                         @RequestParam(defaultValue = "0") int page) {
        return community.feed(userId, page);
    }

    @GetMapping("/posts/{id}")
    public PostView get(@AuthenticationPrincipal String userId, @PathVariable String id) {
        return community.getPost(userId, id);
    }

    @PostMapping("/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public PostView create(@AuthenticationPrincipal String userId,
                           @Valid @RequestBody CreatePostRequest req) {
        return community.create(userId, req);
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal String userId, @PathVariable String id) {
        community.delete(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/posts/{id}/like")
    public LikeResult like(@AuthenticationPrincipal String userId, @PathVariable String id) {
        return community.toggleLike(userId, id);
    }

    @PostMapping("/posts/{id}/share")
    public ShareResult share(@PathVariable String id) {
        return community.share(id);
    }

    // ----- Comments -----
    @GetMapping("/posts/{id}/comments")
    public List<CommentView> comments(@AuthenticationPrincipal String userId, @PathVariable String id) {
        return community.comments(userId, id);
    }

    @PostMapping("/posts/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentView addComment(@AuthenticationPrincipal String userId, @PathVariable String id,
                                  @Valid @RequestBody CreateCommentRequest req) {
        return community.addComment(userId, id, req);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@AuthenticationPrincipal String userId, @PathVariable String id) {
        community.deleteComment(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/comments/{id}/like")
    public LikeResult likeComment(@AuthenticationPrincipal String userId, @PathVariable String id) {
        return community.toggleCommentLike(userId, id);
    }

    // ----- Mute (ẩn người dùng) -----
    @GetMapping("/users/me/muted")
    public List<Author> muted(@AuthenticationPrincipal String userId) {
        return community.mutedUsers(userId);
    }

    @PostMapping("/users/me/muted/{targetId}")
    public ResponseEntity<Void> mute(@AuthenticationPrincipal String userId, @PathVariable String targetId) {
        community.mute(userId, targetId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/me/muted/{targetId}")
    public ResponseEntity<Void> unmute(@AuthenticationPrincipal String userId, @PathVariable String targetId) {
        community.unmute(userId, targetId);
        return ResponseEntity.noContent().build();
    }

    // ----- Khác -----
    @GetMapping("/community/leaderboard")
    public List<LeaderboardEntry> leaderboard() {
        return community.leaderboard();
    }

    // POST /api/uploads/signature?type=post|avatar
    @PostMapping("/uploads/signature")
    public UploadSignature uploadSignature(@RequestParam(defaultValue = "post") String type) {
        return uploads.sign("avatar".equalsIgnoreCase(type) ? UploadService.Kind.AVATAR : UploadService.Kind.POST);
    }
}
