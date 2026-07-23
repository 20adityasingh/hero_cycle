package com.hero_cycle.backend.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record CategoryResponse(
        CategoryDTO categoryDTO,

        List<SubCategoryDTO> subCategoryDTOS
) {
}
