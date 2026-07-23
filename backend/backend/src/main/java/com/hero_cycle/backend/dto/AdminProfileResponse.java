package com.hero_cycle.backend.dto;

import java.util.UUID;

public record AdminProfileResponse(
        UUID id,

        String name,

        String role
) {
}
