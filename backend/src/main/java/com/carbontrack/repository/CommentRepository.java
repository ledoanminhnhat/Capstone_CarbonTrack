package com.carbontrack.repository;

import com.carbontrack.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);

    void deleteByPostId(String postId);

    // vài comment mới nhất (để xem trước dưới bài, lọc người bị ẩn ở service)
    List<Comment> findTop10ByPostIdOrderByCreatedAtDesc(String postId);

    List<Comment> findByUserId(String userId);
}
