package com.hero_cycle.backend.controller;

import com.hero_cycle.backend.dto.*;
import com.hero_cycle.backend.service.AdminService;
import com.hero_cycle.common_lib.security.security.JwtUserPrincipal;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AdminController {

    AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest){

        return ResponseEntity.ok(adminService.login(loginRequest));

    }

    @PostMapping("/createSuperAdmin")
    public ResponseEntity<CreateSuperAdminResponse> signup (@RequestBody @Valid CreateSuperAdminRequest createSuperAdminRequest){
        return ResponseEntity.ok(adminService.createSuperAdmin(createSuperAdminRequest));
    }

    @GetMapping("/checkSuperAdmin")
    public ResponseEntity<String> checkSuperAdmin(){
        CheckSuperAdmin check = adminService.checkSuperAdmin();
        if(check != null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Super Admin Exist");
        }

        return ResponseEntity.ok("Super Admin Does Not Exist");
    }

    @PostMapping("/createAdminOrSalesperson")
    public ResponseEntity<String> createAdminOrSalesperson( @RequestBody @Valid AdminOrSalespersonRequest request){
        return ResponseEntity.ok(adminService.createAdminOrSalesperson(request));
    }

    @GetMapping("/getAllAssignment")
    public ResponseEntity<List<AssignmentResponse>> getAllAssignment(){
        return ResponseEntity.of(Optional.ofNullable(adminService.getAllAssignment()));
    }

    @PostMapping("/createUser")
    public ResponseEntity<String> createUser(@RequestBody @Valid CreateUserRequest request){
        return ResponseEntity.ok(adminService.createUser(request));
    }

    @PostMapping("/createAssignment")
    public ResponseEntity<String> createAssignment(@RequestBody @Valid CreateAssignmentRequest request){
        return ResponseEntity.ok(adminService.createAssignment(request));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestBody DeleteDTO deleteDTO){
        return ResponseEntity.ok(adminService.deleteUser(deleteDTO));
    }
}
