package com.hero_cycle.backend.service.impl;

import com.hero_cycle.backend.entity.Admin;
import com.hero_cycle.backend.enums.Role;
import com.hero_cycle.backend.repository.AdminRepository;
import com.hero_cycle.common_lib.security.security.JwtUserPrincipal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminAuthServiceTest {

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private AdminAuthService adminAuthService;

    @Test
    void loadUserByUsername_Success() {
        Admin admin = new Admin();
        admin.setId(UUID.randomUUID());
        admin.setName("Admin Name");
        admin.setUsername("adminUser");
        admin.setPassword("password");
        admin.setRole(Role.ADMIN);

        when(adminRepository.findByUsername(anyString())).thenReturn(Optional.of(admin));

        UserDetails userDetails = adminAuthService.loadUserByUsername("adminUser");

        assertNotNull(userDetails);
        assertTrue(userDetails instanceof JwtUserPrincipal);
        assertEquals("adminUser", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
    }

    @Test
    void loadUserByUsername_NotFound() {
        when(adminRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> adminAuthService.loadUserByUsername("unknownUser"));
    }
}
