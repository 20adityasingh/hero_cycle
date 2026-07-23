package com.hero_cycle.backend.dto;

import lombok.Builder;

@Builder
public record UserResponse(
        String name,
        String username,
        String role
) {
}
