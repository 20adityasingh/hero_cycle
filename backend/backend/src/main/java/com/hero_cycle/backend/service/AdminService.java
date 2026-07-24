package com.hero_cycle.backend.service;

import com.hero_cycle.backend.dto.*;

import java.util.List;

public interface AdminService {

    LoginResponse login(LoginRequest loginRequest);

    CreateSuperAdminResponse createSuperAdmin (CreateSuperAdminRequest createSuperAdminRequest);

    CheckSuperAdmin checkSuperAdmin();



    List<AssignmentResponse> getAllAssignment();

    String createUser(CreateUserRequest request);

    String createAssignment(CreateAssignmentRequest request);

    List<UserResponse> getAllUsers();

    String deleteUser(DeleteDTO deleteDTO);

    String updateUserRole(UpdateRoleRequest request);

    String updateAssignment(UpdateAssignmentRequest request);
}
