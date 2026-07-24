package com.hero_cycle.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdateAssignmentRequest(
        @NotNull(message = "Assignment ID cannot be null")
        UUID assignmentId,
        
        @NotBlank(message = "Category Name cannot be blank")
        String newCategory,
        
        @NotBlank(message = "SubCategory Name cannot be blank")
        String newSubCategory
) {
}
