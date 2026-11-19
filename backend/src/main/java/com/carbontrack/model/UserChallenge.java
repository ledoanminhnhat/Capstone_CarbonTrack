package com.carbontrack.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Ghi nhận 1 user đã tham gia 1 challenge. Tiến độ KHÔNG lưu ở đây mà được
 * tính tự động từ activity; chỉ lưu ngày tham gia + trạng thái hoàn thành.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_challenges")
public class UserChallenge implements HasId {

    @Id
    private String id;

    private String userId;
    private String challengeId;
    private String joinedDate;   // ISO "yyyy-MM-dd"
    private String status;       // "IN_PROGRESS" hoặc "COMPLETED"
}
