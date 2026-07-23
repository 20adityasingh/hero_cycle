package com.hero_cycle.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hero_cycle.backend.dto.*;
import com.hero_cycle.backend.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
    controllers = AdminController.class,
    excludeAutoConfiguration = {
        org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration.class,
        org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration.class
    },
    excludeFilters = @org.springframework.context.annotation.ComponentScan.Filter(
        type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE,
        classes = {
            com.hero_cycle.backend.security.AdminSecurityConfig.class,
            com.hero_cycle.common_lib.security.security.JwtAuthFilter.class
        }
    )
)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AdminService adminService;

    @Test
    void login_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "Password@123");
        LoginResponse loginResponse = new LoginResponse("mock-jwt-token", null);

        when(adminService.login(any(LoginRequest.class))).thenReturn(loginResponse);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"));
    }

    @Test
    void checkSuperAdmin_Success() throws Exception {
        when(adminService.checkSuperAdmin()).thenReturn(new CheckSuperAdmin("Super Admin"));

        mockMvc.perform(get("/auth/checkSuperAdmin"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Super Admin Exist"));
    }

    @Test
    void checkSuperAdmin_NotExist() throws Exception {
        when(adminService.checkSuperAdmin()).thenReturn(null);

        mockMvc.perform(get("/auth/checkSuperAdmin"))
                .andExpect(status().isOk())
                .andExpect(content().string("Super Admin Does Not Exist"));
    }

    @Test
    void createUser_Success() throws Exception {
        CreateUserRequest request = new CreateUserRequest("Subham", "subham", "Password@123", "ADMIN");
        when(adminService.createUser(any(CreateUserRequest.class))).thenReturn("User Created Successfully");

        mockMvc.perform(post("/auth/createUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("User Created Successfully"));
    }

    @Test
    void createAssignment_Success() throws Exception {
        CreateAssignmentRequest request = new CreateAssignmentRequest("subham", "Gear", "1st gear");
        when(adminService.createAssignment(any(CreateAssignmentRequest.class))).thenReturn("Assignment Created Successfully");

        mockMvc.perform(post("/auth/createAssignment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Assignment Created Successfully"));
    }

    @Test
    void getAllUsers_Success() throws Exception {
        List<UserResponse> users = Collections.singletonList(new UserResponse("Subham", "subham", "ADMIN"));
        when(adminService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/auth/getAllUsers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("subham"))
                .andExpect(jsonPath("$[0].name").value("Subham"))
                .andExpect(jsonPath("$[0].role").value("ADMIN"));
    }

    @Test
    void deleteUser_Success() throws Exception {
        DeleteDTO deleteDTO = new DeleteDTO("subham");
        when(adminService.deleteUser(any(DeleteDTO.class))).thenReturn("User Deleted Successfully");

        mockMvc.perform(delete("/auth/deleteUser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deleteDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("User Deleted Successfully"));
    }
}
