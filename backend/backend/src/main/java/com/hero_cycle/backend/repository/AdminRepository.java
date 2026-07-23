package com.hero_cycle.backend.repository;

import com.hero_cycle.backend.entity.Admin;
import com.hero_cycle.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {
    Optional<Admin> findByUsername(String username);

    Admin findByRole(Role role);
}
