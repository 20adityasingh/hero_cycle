package com.hero_cycle.backend.service.impl;

import com.hero_cycle.backend.entity.Admin;
import com.hero_cycle.backend.repository.AdminRepository;
import com.hero_cycle.common_lib.security.security.JwtUserPrincipal;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AdminAuthService implements UserDetailsService {

    AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Admin does not exist with username: " + username)
        );

        return new JwtUserPrincipal(
                admin.getId(),
                admin.getName(),
                admin.getUsername(),
                admin.getPassword(),
                admin.getRole().toString(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + admin.getRole().toString()))
        );
    }
}
