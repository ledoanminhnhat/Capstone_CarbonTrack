package com.carbontrack.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Một hoạt động phát thải carbon mà người dùng ghi lại.
 * Lớp này ánh xạ trực tiếp tới một document trong collection "activities" của MongoDB.
 */
@Data                 // Lombok: tự sinh getter/setter/toString...
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activities")
public class Activity implements HasId {

    @Id
    private String id;          // MongoDB tự sinh _id

    private String userId;      // sau này gắn với người dùng
    private String date;        // ví dụ "19/02/2026"
    private String activity;    // ví dụ "Bus", "Lunch"...
    private String detail;      // ví dụ "25km", "1 portion"
    private double co2;         // lượng CO2 (kg)
    private String category;    // Transport / Food / Energy...
    private String status;      // "High" / "Low"
}
