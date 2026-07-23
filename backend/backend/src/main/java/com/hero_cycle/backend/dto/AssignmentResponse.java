package com.hero_cycle.backend.dto;

import lombok.Builder;

@Builder
public record AssignmentResponse(

        String adminName,

        String categoryName,

        String subCategoryName
) {
}
