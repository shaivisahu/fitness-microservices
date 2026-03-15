package com.fittrack.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

public class AuthDto {

    @Data public static class RegisterRequest {
        @NotBlank @Size(min=3, max=50) private String username;
        @NotBlank @Email private String email;
        @NotBlank @Size(min=6) private String password;
        private String firstName, lastName;
        private Double weight, height;
        private Integer age;
    }

    @Data public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }

    @Data public static class AuthResponse {
        private String token;
        private String username, email;
        private Long userId;
        public AuthResponse(String token, String username, String email, Long userId) {
            this.token=token; this.username=username; this.email=email; this.userId=userId;
        }
    }

    @Data public static class UserProfileDto {
        private Long id;
        private String username, email, firstName, lastName;
        private Double weight, height;
        private Integer age;
    }
}
