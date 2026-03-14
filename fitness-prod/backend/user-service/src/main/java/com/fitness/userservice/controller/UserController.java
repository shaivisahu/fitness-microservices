package com.fitness.userservice.controller;

import com.fitness.userservice.dto.*;
import com.fitness.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Service", description = "Register, login and manage user profiles")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @Operation(summary = "Login with email and password")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @Operation(summary = "Get user profile by ID")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @Operation(summary = "Update user profile")
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateProfile(
            @PathVariable String userId,
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @Operation(summary = "Validate user exists (internal use)")
    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.existsById(userId));
    }

    // ─── ADMIN ENDPOINTS ──────────────────────────────────────────
    @Operation(summary = "ADMIN: Get all users")
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "ADMIN: Delete a user")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "ADMIN: Promote user to admin")
    @PutMapping("/{userId}/make-admin")
    public ResponseEntity<UserResponse> makeAdmin(@PathVariable String userId) {
        return ResponseEntity.ok(userService.makeAdmin(userId));
    }
}
