package com.hero_cycle.backend.dto;

public record LoginResponse(

        String token,

        AdminProfileResponse adminProfileResponse
) {
}
