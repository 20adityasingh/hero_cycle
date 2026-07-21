package com.hero_cycle.common_lib.security.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

public record UserDTO(

        UUID adminId,

        String name,

        String username,

        String role
) {
}
