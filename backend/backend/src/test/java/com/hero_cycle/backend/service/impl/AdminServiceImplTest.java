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
import com.hero_cycle.common_lib.security.security.AuthUtils;
import com.hero_cycle.common_lib.security.security.JwtUserPrincipal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private AuthUtils authUtils;
    @Mock
    private AdminMapper adminMapper;
    @Mock
    private AdminRepository adminRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private SubCategoryRepository subCategoryRepository;
    @Mock
    private AssignmentRepository assignmentRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    void login_Success() {
        LoginRequest loginRequest = mock(LoginRequest.class);
        when(loginRequest.username()).thenReturn("admin");
        when(loginRequest.password()).thenReturn("password");

        JwtUserPrincipal principal = mock(JwtUserPrincipal.class);
        when(principal.getUsername()).thenReturn("admin");
        when(principal.role()).thenReturn("SUPER_ADMIN");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(principal);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        when(adminMapper.toUserDTO(principal)).thenReturn(null);
        when(authUtils.getAccessToken(any())).thenReturn("dummy-token");

        when(adminMapper.toAdminProfileResponse(principal)).thenReturn(null);

        LoginResponse response = adminService.login(loginRequest);

        assertNotNull(response);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(authUtils).getAccessToken(any());
        verify(adminMapper).toAdminProfileResponse(principal);
    }

    @Test
    void createSuperAdmin_Success() {
        CreateSuperAdminRequest request = mock(CreateSuperAdminRequest.class);
        when(request.username()).thenReturn("super");
        when(request.password()).thenReturn("pass");
        when(request.name()).thenReturn("SuperAdmin");

        when(adminRepository.findByRole(Role.SUPER_ADMIN)).thenReturn(null);
        when(adminRepository.findByUsername("super")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass")).thenReturn("encoded-pass");

        Admin savedAdmin = new Admin();
        savedAdmin.setName("SuperAdmin");
        savedAdmin.setUsername("super");
        when(adminRepository.save(any(Admin.class))).thenReturn(savedAdmin);

        CreateSuperAdminResponse response = adminService.createSuperAdmin(request);

        assertNotNull(response);
        verify(adminRepository).save(any(Admin.class));
    }

    @Test
    void createUser_Success() {
        CreateUserRequest request = mock(CreateUserRequest.class);
        when(request.username()).thenReturn("testuser");
        when(request.password()).thenReturn("pass");
        when(request.name()).thenReturn("Test User");
        when(request.role()).thenReturn("ADMIN");

        when(adminRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass")).thenReturn("encoded-pass");

        Admin savedAdmin = new Admin();
        when(adminRepository.save(any(Admin.class))).thenReturn(savedAdmin);

        String response = adminService.createUser(request);

        assertEquals("User Created Successfully", response);
        verify(adminRepository).save(any(Admin.class));
    }

    @Test
    void createAssignment_Success() {
        CreateAssignmentRequest request = mock(CreateAssignmentRequest.class);
        when(request.username()).thenReturn("user1");
        when(request.category()).thenReturn("cat1");
        when(request.subCategory()).thenReturn("subcat1");

        Admin admin = new Admin();
        admin.setUsername("user1");
        when(adminRepository.findByUsername("user1")).thenReturn(Optional.of(admin));

        Category category = new Category();
        category.setName("cat1");
        when(categoryRepository.findByName("cat1")).thenReturn(category);

        SubCategory subCategory = new SubCategory();
        subCategory.setName("subcat1");
        when(subCategoryRepository.findByName("subcat1")).thenReturn(subCategory);

        when(assignmentRepository.save(any(Assignment.class))).thenReturn(new Assignment());

        String response = adminService.createAssignment(request);

        assertEquals("Assignment Created Successfully", response);
        verify(assignmentRepository).save(any(Assignment.class));
    }
}
