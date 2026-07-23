package com.hero_cycle.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AdminOrSalespersonRequest(
        @NotBlank(message = "Name cannot be empty")
        @Size(min = 1, max = 25, message = "Name must be between 1 and 25 characters")
        String name,

        @NotBlank(message = "Username cannot be empty")
        String username,

        @NotBlank(message = "Password cannot be empty")
        @Size(min = 8, max = 32, message = "Password must be between 8 and 32 characters")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
                message = "Password must contain at least one digit, one lowercase, one uppercase letter, and one special character (@#$%^&+=!)"
        )
        String password,

        @NotBlank(message = "Role cannot be empty")
        String role,

        @NotBlank(message = "Category Name cannot be empty")
        String category,

        @NotBlank(message = "SubCategory Name cannot be empty")
        String subCategory
) {
}
