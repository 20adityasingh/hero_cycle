package com.hero_cycle.backend.repository;

import com.hero_cycle.backend.entity.Admin;
import com.hero_cycle.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {

    @Query("""
        select a from Admin a where a.username = :username and a.deletedAt is null
""")
    Optional<Admin> findByUsername(@Param("username") String username);

    Admin findByRole(Role role);

    @Query("""
        select a from Admin a where a.role != :role and a.deletedAt is null
""")
    List<Admin> findAllNonSuperAdminUsers(@Param("role") Role role);

    @Query("""
        select a from Admin a where a.username = :username
""")
    Optional<Admin> findByUsernameIncludingDeleted(@Param("username") String username);
}
