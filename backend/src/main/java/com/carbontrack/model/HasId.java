package com.carbontrack.model;

/**
 * Mọi document có id kiểu String. Dùng để 1 callback chung tự gán UUID khi tạo mới.
 */
public interface HasId {
    String getId();
    void setId(String id);
}
