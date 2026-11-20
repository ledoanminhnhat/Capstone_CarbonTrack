package com.carbontrack.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/** 1 bình luận dưới bài đăng. */
@Data
@NoArgsConstructor
@Document(collection = "comments")
public class Comment implements HasId {

    @Id
    private String id;

    @Indexed
    private String postId;

    /** null = comment gốc; khác null = reply của comment gốc đó (chỉ 2 tầng). */
    @Indexed
    private String parentId;

    private String userId;
    private String content;
    private Instant createdAt;

    private List<String> likedBy = new ArrayList<>(); // id các user đã like comment
}
