package com.hero_cycle.backend.repository;

import com.hero_cycle.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Category findByName(String category);

    @Query("""
            select c from Category c where c.id = :id
            """)
    Category findByCategoryId(@Param("id") UUID categoryId);
}
