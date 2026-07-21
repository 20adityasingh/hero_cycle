package com.hero_cycle.backend.entity;

import jakarta.persistence.*;

import java.util.UUID;

public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    Admin adminId;

    @ManyToOne(fetch = FetchType.LAZY)
    Category categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    SubCategory subCategoryId;
}
