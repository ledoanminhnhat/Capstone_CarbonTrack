package com.carbontrack.repository;

import com.carbontrack.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);

    void deleteByPostId(String postId);

    List<Comment> findByUserId(String userId);

    // comment gốc mới nhất (xem trước dưới bài, không lấy reply)
    List<Comment> findTop10ByPostIdAndParentIdIsNullOrderByCreatedAtDesc(String postId);

    long countByParentId(String parentId);

    void deleteByParentId(String parentId);
}
