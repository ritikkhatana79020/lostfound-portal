package com.shweta.lostfound_portal.dto;

import com.shweta.lostfound_portal.enums.ItemStatus;
import com.shweta.lostfound_portal.enums.ItemType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDTO {
    private Long id;
    private ItemType type;
    private String itemName;
    private String description;
    private String location;
    private String photoUrl;
    private String photoPath;
    private String studentName;
    private String studentNumber;
    private String foundBy;
    private ItemStatus status;
    private LocalDateTime dateReported;
    private LocalDateTime dateFound;
    private Long matchedWith;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

