package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    public UserResponse register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getLastName());
        user.setLastName(request.getLastName());
    }
}
