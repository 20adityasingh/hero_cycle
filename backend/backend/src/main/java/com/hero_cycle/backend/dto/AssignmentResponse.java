package com.hero_cycle.backend.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record AssignmentResponse(

        UUID id,

        String adminName,

        String categoryName,

        String subCategoryName
) {
}
