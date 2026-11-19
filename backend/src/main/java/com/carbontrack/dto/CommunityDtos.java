package com.carbontrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public class CommunityDtos {

    public static final int MAX_CONTENT = 5000;
    public static final int MAX_IMAGES = 3;
    public static final int MAX_COMMENT = 1000;

    public record CreatePostRequest(
            @Size(max = MAX_CONTENT) String content,
            @Size(max = MAX_IMAGES) List<String> imageUrls
    ) {}

    public record CreateCommentRequest(
            @NotBlank @Size(max = MAX_COMMENT) String content
    ) {}

    public record Author(String id, String name, String avatarUrl) {}

    /** Bài đăng đã kèm thông tin cho người đang xem. */
    public record PostView(
            String id,
            Author author,
            String content,
            List<String> imageUrls,
            int likeCount,
            boolean likedByMe,
            int commentCount,
            int shareCount,
            Instant createdAt,
            boolean canDelete       // tác giả hoặc admin
    ) {}

    public record FeedPage(List<PostView> posts, int page, boolean hasMore) {}

    public record CommentView(
            String id,
            Author author,
            String content,
            Instant createdAt,
            boolean canDelete,
            int likeCount,
            boolean likedByMe
    ) {}

    public record LikeResult(int likeCount, boolean likedByMe) {}

    public record ShareResult(int shareCount) {}

    public record LeaderboardEntry(String id, String name, String avatarUrl, int points) {}

    /** Thông tin để frontend upload ảnh thẳng lên Cloudinary (signed upload). */
    public record UploadSignature(
            String cloudName,
            String apiKey,
            long timestamp,
            String signature,
            String folder,
            String allowedFormats,
            String transformation,
            long maxBytes
    ) {}
}
