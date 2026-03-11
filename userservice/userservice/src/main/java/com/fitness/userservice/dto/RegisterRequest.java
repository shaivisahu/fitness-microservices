package com.fitness.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invaid emial format")
    private String Email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be atleast of 6 character")
    private String Password;

    private String FirstName;
    private String LastName;

    public String getPassword() {
    }

    public String getLastName() {
    }

    public String getEmail() {
    }
}
