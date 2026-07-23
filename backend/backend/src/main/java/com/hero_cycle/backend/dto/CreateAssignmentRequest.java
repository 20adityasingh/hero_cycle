package com.hero_cycle.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateAssignmentRequest(

        @NotBlank(message = "Username cannot be empty")
        String username,

        @NotBlank(message = "Category Name cannot be empty")
        String category,

        @NotBlank(message = "SubCategory Name cannot be empty")
        String subCategory
) {
}
