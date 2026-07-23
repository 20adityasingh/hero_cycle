package com.hero_cycle.backend.service.impl;

import com.hero_cycle.backend.dto.*;
import com.hero_cycle.backend.entity.Admin;
import com.hero_cycle.backend.entity.Assignment;
import com.hero_cycle.backend.entity.Category;
import com.hero_cycle.backend.entity.SubCategory;
import com.hero_cycle.backend.enums.Role;
import com.hero_cycle.backend.mapper.AdminMapper;
import com.hero_cycle.backend.repository.AdminRepository;
import com.hero_cycle.backend.repository.AssignmentRepository;
import com.hero_cycle.backend.repository.CategoryRepository;
import com.hero_cycle.backend.repository.SubCategoryRepository;
import com.hero_cycle.backend.service.AdminService;
import com.hero_cycle.common_lib.security.security.AuthUtils;
import com.hero_cycle.common_lib.security.security.JwtUserPrincipal;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    AuthenticationManager authenticationManager;
    AuthUtils authUtils;
    AdminMapper adminMapper;
    AdminRepository adminRepository;
    PasswordEncoder passwordEncoder;
    CategoryRepository categoryRepository;
    SubCategoryRepository subCategoryRepository;
    AssignmentRepository assignmentRepository;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("Login attempt for username: {}", loginRequest.username());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
        );

        JwtUserPrincipal admin = (JwtUserPrincipal) authentication.getPrincipal();
        log.info("Login successful for username: {} with role: {}", admin.getUsername(), admin.role());
        return new LoginResponse(authUtils.getAccessToken(adminMapper.toUserDTO(admin)), adminMapper.toAdminProfileResponse(admin));
    }

    @Override
    @Transactional
    public CreateSuperAdminResponse createSuperAdmin(CreateSuperAdminRequest createSuperAdminRequest) {
        log.info("Attempting to create Super Admin with username: {}", createSuperAdminRequest.username());

        if (checkSuperAdmin() != null) {
            log.error("Super Admin creation failed: Super Admin already exists.");
            throw new IllegalStateException("Super Admin already exists.");
        }

        if (adminRepository.findByUsername(createSuperAdminRequest.username()).isPresent()) {
            log.error("Super Admin creation failed: Username '{}' is already taken.", createSuperAdminRequest.username());
            throw new IllegalArgumentException("Username is already taken.");
        }

        Admin admin = new Admin();

        admin.setName(createSuperAdminRequest.name());
        admin.setPassword(passwordEncoder.encode(createSuperAdminRequest.password()));
        admin.setRole(Role.SUPER_ADMIN);
        admin.setUsername(createSuperAdminRequest.username());
        admin = adminRepository.save(admin);
        log.info("Super Admin created successfully with name: {} and username: {}", admin.getName(), admin.getUsername());
        return new CreateSuperAdminResponse(
                admin.getName(),
                "Super Admin Created Successfully."
        );
    }

    @Override
    public CheckSuperAdmin checkSuperAdmin() {
        log.info("Checking if Super Admin exists.");
        Role role = Role.SUPER_ADMIN;
        Admin admin = adminRepository.findByRole(role);

        if(admin != null){
            log.info("Super Admin found: {}", admin.getName());
            return new CheckSuperAdmin(
                    admin.getName()
            );
        }
        log.info("No Super Admin found in the system.");
        return null;
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String createAdminOrSalesperson(AdminOrSalespersonRequest request) {
        log.info("Attempting to create {} with username: {}", request.role(), request.username());

        if (adminRepository.findByUsername(request.username()).isPresent()) {
            log.error("User creation failed: Username '{}' is already taken.", request.username());
            throw new IllegalArgumentException("Username is already taken.");
        }

        Admin admin = new Admin();

        admin.setName(request.name());
        admin.setPassword(passwordEncoder.encode(request.password()));
        if(Objects.equals(request.role(), "ADMIN")) {
            admin.setRole(Role.ADMIN);
        }else{
            admin.setRole(Role.SALESPERSON);
        }
        admin.setUsername(request.username());
        admin = adminRepository.save(admin);
        log.info("Admin/Salesperson saved with id: {} and role: {}", admin.getId(), admin.getRole());

        Category category = categoryRepository.findByName(request.category());
        if (category == null) {
            log.error("Assignment creation failed: Category '{}' not found.", request.category());
            throw new IllegalArgumentException("Category not found: " + request.category());
        }

        SubCategory subCategory = subCategoryRepository.findByName(request.subCategory());
        if (subCategory == null) {
            log.error("Assignment creation failed: SubCategory '{}' not found.", request.subCategory());
            throw new IllegalArgumentException("SubCategory not found: " + request.subCategory());
        }

        Assignment assignment = new Assignment();
        assignment.setAdminId(admin);
        assignment.setCategoryId(category);
        assignment.setSubCategoryId(subCategory);
        assignmentRepository.save(assignment);
        log.info("Assignment created for admin: {} -> category: {} -> subCategory: {}", admin.getUsername(), category.getName(), subCategory.getName());

        return "Assignment Created Successfully";
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<AssignmentResponse> getAllAssignment() {
        List<Assignment> assignments = assignmentRepository.findAllWithRelations();

        return assignments.stream()
                .map( assignment -> AssignmentResponse.builder()
                        .adminName(assignment.getAdminId().getName())
                        .categoryName(assignment.getCategoryId().getName())
                        .subCategoryName(assignment.getSubCategoryId().getName())
                        .build())
                .collect(Collectors.toList());
    }




}
