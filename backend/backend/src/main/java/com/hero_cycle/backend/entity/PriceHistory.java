package com.hero_cycle.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    SubCategory subCategoryId;

    Float amount;

    @CreationTimestamp
    Instant createdAt;
}
