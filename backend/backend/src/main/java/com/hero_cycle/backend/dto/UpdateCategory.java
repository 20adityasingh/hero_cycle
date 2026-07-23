package com.hero_cycle.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCategory(

        @NotBlank(message = "Name cannot be empty")
        @Size(min = 1, max = 15, message = "Name must be between 1 and 15 characters")
        String name
) {
}
