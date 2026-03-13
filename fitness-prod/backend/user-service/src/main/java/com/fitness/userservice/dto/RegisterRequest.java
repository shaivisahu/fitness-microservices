package com.fitness.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @Min(value = 10, message = "Age must be at least 10")
    @Max(value = 100, message = "Age must be under 100")
    private Integer age;

    @DecimalMin(value = "20.0", message = "Weight must be at least 20kg")
    @DecimalMax(value = "300.0", message = "Weight must be under 300kg")
    private Double weightKg;

    @DecimalMin(value = "50.0", message = "Height must be at least 50cm")
    @DecimalMax(value = "250.0", message = "Height must be under 250cm")
    private Double heightCm;

    private String fitnessGoal;
}
