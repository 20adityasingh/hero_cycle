package com.hero_cycle.backend.entity;

import com.hero_cycle.backend.enums.Role;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    String name;

    String username;

    String password;

    @Enumerated(value = EnumType.STRING)
    Role role;

    @CreationTimestamp
    Instant createdAt;

    Instant deletedAt;
}
