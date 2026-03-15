package com.fittrack.auth.controller;

import com.fittrack.auth.dto.AuthDto;
import com.fittrack.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/profile")
    public ResponseEntity<AuthDto.UserProfileDto> profile(@RequestHeader("X-Auth-User") String username) {
        return ResponseEntity.ok(authService.getProfile(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthDto.UserProfileDto> updateProfile(
            @RequestHeader("X-Auth-User") String username,
            @RequestBody AuthDto.UserProfileDto dto) {
        return ResponseEntity.ok(authService.updateProfile(username, dto));
    }
}
