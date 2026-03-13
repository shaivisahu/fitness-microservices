package com.fitness.userservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private Double weightKg;
    private Double heightCm;
    private Integer age;
    private String fitnessGoal;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
