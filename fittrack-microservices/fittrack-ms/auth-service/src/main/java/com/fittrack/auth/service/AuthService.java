package com.fittrack.auth.service;

import com.fittrack.auth.dto.AuthDto;
import com.fittrack.auth.entity.User;
import com.fittrack.auth.repository.UserRepository;
import com.fittrack.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final UserDetailsService uds;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
        if (repo.existsByUsername(req.getUsername())) throw new RuntimeException("Username taken");
        if (repo.existsByEmail(req.getEmail())) throw new RuntimeException("Email registered");

        var user = User.builder()
                .username(req.getUsername()).email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .firstName(req.getFirstName()).lastName(req.getLastName())
                .weight(req.getWeight()).height(req.getHeight()).age(req.getAge())
                .build();
        repo.save(user);

        String token = jwtUtil.generateToken(uds.loadUserByUsername(user.getUsername()));
        return new AuthDto.AuthResponse(token, user.getUsername(), user.getEmail(), user.getId());
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        var user = repo.findByUsername(req.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(uds.loadUserByUsername(user.getUsername()));
        return new AuthDto.AuthResponse(token, user.getUsername(), user.getEmail(), user.getId());
    }

    public AuthDto.UserProfileDto getProfile(String username) {
        var u = repo.findByUsername(username).orElseThrow();
        var dto = new AuthDto.UserProfileDto();
        dto.setId(u.getId()); dto.setUsername(u.getUsername()); dto.setEmail(u.getEmail());
        dto.setFirstName(u.getFirstName()); dto.setLastName(u.getLastName());
        dto.setWeight(u.getWeight()); dto.setHeight(u.getHeight()); dto.setAge(u.getAge());
        return dto;
    }

    public AuthDto.UserProfileDto updateProfile(String username, AuthDto.UserProfileDto dto) {
        var u = repo.findByUsername(username).orElseThrow();
        u.setFirstName(dto.getFirstName()); u.setLastName(dto.getLastName());
        u.setWeight(dto.getWeight()); u.setHeight(dto.getHeight()); u.setAge(dto.getAge());
        repo.save(u);
        return getProfile(username);
    }
}
