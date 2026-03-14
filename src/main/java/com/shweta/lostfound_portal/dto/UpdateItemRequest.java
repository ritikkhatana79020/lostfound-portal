package com.shweta.lostfound_portal.dto;

import com.shweta.lostfound_portal.enums.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateItemRequest {
    private String description;
    private String location;
    private String photoUrl;
    private String photoPath;
    private ItemStatus status;
    private String studentName;
    private String studentNumber;
}

