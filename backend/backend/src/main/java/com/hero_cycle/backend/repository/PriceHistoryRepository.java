package com.hero_cycle.backend.repository;

import com.hero_cycle.backend.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, UUID> {
}
