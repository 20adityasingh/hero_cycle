package com.hero_cycle.backend.dto;

import lombok.Builder;

@Builder
public record SubCategoryName(
        String name,
        String categoryName
) {
}
