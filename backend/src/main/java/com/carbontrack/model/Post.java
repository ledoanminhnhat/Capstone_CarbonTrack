package com.carbontrack.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/** 1 bài đăng trong Community. */
@Data
@NoArgsConstructor
@Document(collection = "posts")
public class Post implements HasId {

    @Id
    private String id;

    @Indexed
    private String userId;          // tác giả

    private String content;         // nội dung chữ (tối đa 5000 ký tự)
    private List<String> imageUrls = new ArrayList<>(); // tối đa 3 ảnh Cloudinary

    private List<String> likedBy = new ArrayList<>();   // id các user đã like
    private int commentCount;
    private List<String> sharedBy = new ArrayList<>();  // id các user đã share (mỗi người tính 1 lần)
    private int shareCount;     // = số người trong sharedBy + số share cũ (trước khi lưu sharedBy)

    @Indexed
    private Instant createdAt;
}
