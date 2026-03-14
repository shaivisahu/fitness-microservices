package com.fitness.userservice.service;

import com.fitness.userservice.dto.*;
import com.fitness.userservice.model.User;
import com.fitness.userservice.model.UserRole;
import com.fitness.userservice.repository.UserRepository;
import com.fitness.userservice.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger log = Logger.getLogger(UserService.class.getName());

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setWeightKg(request.getWeightKg());
        user.setHeightCm(request.getHeightCm());
        user.setAge(request.getAge());
        user.setFitnessGoal(request.getFitnessGoal());

        // First ever user becomes ADMIN automatically
        if (userRepository.count() == 0) {
            user.setRole(UserRole.ADMIN);
            log.info("First user registered as ADMIN: " + request.getEmail());
        }

        User saved = userRepository.save(user);
        log.info("New user registered: " + saved.getEmail());
        String token = jwtService.generateToken(saved.getId(), saved.getEmail());
        return new AuthResponse(token, mapToResponse(saved));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        log.info("User logged in: " + user.getEmail());
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, mapToResponse(user));
    }

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return mapToResponse(user);
    }

    public UserResponse updateProfile(String userId, RegisterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setWeightKg(request.getWeightKg());
        user.setHeightCm(request.getHeightCm());
        user.setAge(request.getAge());
        user.setFitnessGoal(request.getFitnessGoal());
        return mapToResponse(userRepository.save(user));
    }

    public boolean existsById(String userId) {
        return userRepository.existsById(userId);
    }

    // ─── ADMIN METHODS ────────────────────────────────────────────
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        if (user.getRole() == UserRole.ADMIN) {
            throw new RuntimeException("Cannot delete an admin user.");
        }
        userRepository.deleteById(userId);
        log.info("User deleted by admin: " + userId);
    }

    public UserResponse makeAdmin(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setRole(UserRole.ADMIN);
        return mapToResponse(userRepository.save(user));
    }

    private UserResponse mapToResponse(User user) {
        UserResponse r = new UserResponse();
        r.setId(user.getId());
        r.setEmail(user.getEmail());
        r.setFirstName(user.getFirstName());
        r.setLastName(user.getLastName());
        r.setWeightKg(user.getWeightKg());
        r.setHeightCm(user.getHeightCm());
        r.setAge(user.getAge());
        r.setFitnessGoal(user.getFitnessGoal());
        r.setRole(user.getRole().name());
        r.setCreatedAt(user.getCreatedAt());
        r.setUpdatedAt(user.getUpdatedAt());
        return r;
    }
}
