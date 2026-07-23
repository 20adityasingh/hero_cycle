package com.hero_cycle.backend.repository;

import com.hero_cycle.backend.dto.SubCategoryDTO;
import com.hero_cycle.backend.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, UUID> {
    SubCategory findByName(String s);

    @Query("""
        select new com.hero_cycle.backend.dto.SubCategoryDTO(s.name, s.amount, s.categoryId.name) 
        from SubCategory s 
        where s.categoryId.id = :id
""")
    List<SubCategoryDTO> findByCategoryId(@Param("id") UUID id);
}
