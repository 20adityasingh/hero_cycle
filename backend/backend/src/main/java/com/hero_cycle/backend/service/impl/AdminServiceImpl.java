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

import java.time.Instant;
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

        if (adminRepository.findByName(createSuperAdminRequest.name()).isPresent()) {
            log.error("Super Admin creation failed: Name '{}' is already taken.", createSuperAdminRequest.name());
            throw new IllegalArgumentException("Name is already taken.");
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
    public List<AssignmentResponse> getAllAssignment() {
        List<Assignment> assignments = assignmentRepository.findAllWithRelations();

        return assignments.stream()
                .filter(a -> a.getCategoryId().getDeletedAt() == null && a.getSubCategoryId().getDeletedAt() == null && a.getAdminId().getDeletedAt() == null)
                .map( assignment -> AssignmentResponse.builder()
                        .id(assignment.getId())
                        .adminName(assignment.getAdminId().getName())
                        .categoryName(assignment.getCategoryId().getName())
                        .subCategoryName(assignment.getSubCategoryId().getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String updateUserRole(UpdateRoleRequest request) {
        log.info("Attempting to update role for user: {}", request.username());
        Admin admin = adminRepository.findByUsername(request.username())
                .orElseThrow(() -> {
                    log.error("User not found: {}", request.username());
                    return new IllegalArgumentException("User not found: " + request.username());
                });

        if (Objects.equals(request.newRole(), "ADMIN")) {
            admin.setRole(Role.ADMIN);
        } else if (Objects.equals(request.newRole(), "SALESPERSON")) {
            admin.setRole(Role.SALESPERSON);
        } else {
            throw new IllegalArgumentException("Invalid role provided: " + request.newRole());
        }
        
        adminRepository.save(admin);
        log.info("Successfully updated role to {} for user: {}", admin.getRole(), request.username());
        return "User Role Updated Successfully";
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String updateAssignment(UpdateAssignmentRequest request) {
        log.info("Attempting to update assignment ID: {}", request.assignmentId());
        Assignment assignment = assignmentRepository.findById(request.assignmentId())
                .orElseThrow(() -> {
                    log.error("Assignment not found with id: {}", request.assignmentId());
                    return new IllegalArgumentException("Assignment not found");
                });

        Category newCategory = categoryRepository.findByName(request.newCategory());
        if (newCategory == null) {
            log.error("Category '{}' not found", request.newCategory());
            throw new IllegalArgumentException("Category not found: " + request.newCategory());
        }

        SubCategory newSubCategory = subCategoryRepository.findByName(request.newSubCategory());
        if (newSubCategory == null) {
            log.error("SubCategory '{}' not found", request.newSubCategory());
            throw new IllegalArgumentException("SubCategory not found: " + request.newSubCategory());
        }

        assignment.setCategoryId(newCategory);
        assignment.setSubCategoryId(newSubCategory);
        assignmentRepository.save(assignment);
        log.info("Successfully updated assignment ID: {}", request.assignmentId());
        return "Assignment Updated Successfully";
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String createUser(CreateUserRequest request) {
        log.info("Attempting to create user with username: {}", request.username());

        if (adminRepository.findByUsername(request.username()).isPresent()) {
            log.error("User creation failed: Username '{}' is already taken.", request.username());
            throw new IllegalArgumentException("Username is already taken.");
        }

        if (adminRepository.findByName(request.name()).isPresent()) {
            log.error("User creation failed: Name '{}' is already taken.", request.name());
            throw new IllegalArgumentException("Name is already taken.");
        }

        Admin admin = new Admin();
        admin.setName(request.name());
        admin.setPassword(passwordEncoder.encode(request.password()));
        admin.setUsername(request.username());
        if (Objects.equals(request.role(), "ADMIN")) {
            admin.setRole(Role.ADMIN);
        } else {
            admin.setRole(Role.SALESPERSON);
        }
        adminRepository.save(admin);
        log.info("User '{}' created with role: {}", admin.getUsername(), admin.getRole());
        return "User Created Successfully";
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String createAssignment(CreateAssignmentRequest request) {
        log.info("Attempting to create assignment for username: {}", request.username());

        Admin admin = adminRepository.findByUsername(request.username())
                .orElseThrow(() -> {
                    log.error("Assignment creation failed: User '{}' not found.", request.username());
                    return new IllegalArgumentException("User not found: " + request.username());
                });

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
        log.info("Assignment created: {} -> {} -> {}", admin.getUsername(), category.getName(), subCategory.getName());
        return "Assignment Created Successfully";
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<UserResponse> getAllUsers() {
        log.info("Fetching all non-super-admin users.");
        return adminRepository.findAllNonSuperAdminUsers(Role.SUPER_ADMIN)
                .stream()
                .map(admin -> UserResponse.builder()
                        .name(admin.getName())
                        .username(admin.getUsername())
                        .role(admin.getRole().name())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String deleteUser(DeleteDTO deleteDTO) {
        log.info("Attempting to soft-delete user with username: {}", deleteDTO.name());
        Admin admin = adminRepository.findByUsername(deleteDTO.name())
                .orElseThrow(() -> {
                    log.error("Delete failed: User '{}' not found.", deleteDTO.name());
                    return new IllegalArgumentException("User not found: " + deleteDTO.name());
                });
        admin.setDeletedAt(Instant.now());
        adminRepository.save(admin);
        log.info("User '{}' deleted successfully.", deleteDTO.name());
        return "User Deleted Successfully";
    }




}
