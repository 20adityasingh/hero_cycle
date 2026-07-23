package com.hero_cycle.backend.service;

import com.hero_cycle.backend.dto.*;
import org.springframework.http.ProblemDetail;

import java.util.List;

public interface AdminService {

    LoginResponse login(LoginRequest loginRequest);

    CreateSuperAdminResponse createSuperAdmin (CreateSuperAdminRequest createSuperAdminRequest);

    CheckSuperAdmin checkSuperAdmin();

    String createAdminOrSalesperson(AdminOrSalespersonRequest request);

    List<AssignmentResponse> getAllAssignment();
}
