package com.hero_cycle.backend.repository;

import com.hero_cycle.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    @Query("SELECT a FROM Assignment a JOIN FETCH a.adminId JOIN FETCH a.categoryId JOIN FETCH a.subCategoryId")
    List<Assignment> findAllWithRelations();

    @Query("""
        SELECT a FROM Assignment a JOIN FETCH a.adminId JOIN FETCH a.categoryId JOIN FETCH a.subCategoryId WHERE a.adminId.id = :adminId
""")
    List<Assignment> findByAdminIdWithRelation(@Param("adminId")UUID adminId);

    List<Assignment> findBySubCategoryId(com.hero_cycle.backend.entity.SubCategory subCategoryId);
}
