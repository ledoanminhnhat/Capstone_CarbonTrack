package com.carbontrack.repository;

import com.carbontrack.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {

    // Feed: bỏ bài của những user đã bị mình ẩn (danh sách rỗng = lấy hết)
    Page<Post> findByUserIdNotInOrderByCreatedAtDesc(Collection<String> excludedUserIds, Pageable pageable);

    List<Post> findByUserId(String userId);

    void deleteByUserId(String userId);
}
