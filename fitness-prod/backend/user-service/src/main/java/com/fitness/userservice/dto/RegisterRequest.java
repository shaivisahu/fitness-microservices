package com.fitness.userservice.dto;

import jakarta.validation.constraints.*;

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

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public Double getHeightCm() { return heightCm; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }
    public String getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }
}
