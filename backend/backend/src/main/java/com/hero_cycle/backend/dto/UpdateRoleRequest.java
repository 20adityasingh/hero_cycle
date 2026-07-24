package com.hero_cycle.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateRoleRequest(
        @NotBlank(message = "Username cannot be blank")
        String username,
        
        @NotBlank(message = "New role cannot be blank")
        String newRole
) {
}
