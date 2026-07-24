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

    @Query("""
        select sb from SubCategory sb where LOWER(sb.name) = LOWER(:subCategoryName) and sb.deletedAt is null
""")
    SubCategory findByName(@Param("subCategoryName") String s);

    @Query("""
        select new com.hero_cycle.backend.dto.SubCategoryDTO(s.name, s.amount, s.categoryId.name) 
        from SubCategory s 
        where s.categoryId.id = :id
""")
    List<SubCategoryDTO> findByCategoryId(@Param("id") UUID id);

    @Query("""
        select s from SubCategory s 
        where s.categoryId.id = :id and s.deletedAt is null
""")
    List<SubCategory> findEntitiesByCategoryId(@Param("id") UUID id);
}
