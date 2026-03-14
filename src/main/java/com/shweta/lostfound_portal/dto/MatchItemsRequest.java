package com.shweta.lostfound_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchItemsRequest {
    private Long lostItemId;
    private Long foundItemId;
}

