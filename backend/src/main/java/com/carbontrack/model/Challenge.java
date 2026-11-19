package com.carbontrack.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * 1 thử thách trong kho (do admin tạo / seed sẵn).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "challenges")
public class Challenge implements HasId {

    @Id
    private String id;

    private String title;
    private String description;
    private int points;         // điểm thưởng khi hoàn thành

    // Luật auto-đếm
    private String matchType;   // "SUBCATEGORY" hoặc "CATEGORY"
    private String matchValue;  // vd "Bus" (subcategory) hoặc "Transport" (category)
    private int target;         // số lần cần đạt

    private boolean active;     // còn mở cho tham gia không
}
