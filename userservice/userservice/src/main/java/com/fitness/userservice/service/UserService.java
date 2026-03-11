package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.Getter;
import lombok.Setter;

@Service
public class UserService {
    @Autowired
    private UserRepository repository;
    public UserResponse register(RegisterRequest request) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId();
        userResponse.setEmail(request.getEmail());
        userResponse.setPassword(request.getPassword());
        userResponse.setFirstName(request.getFirstName());
        userResponse.setLastName(request.getLastName());
        userResponse.setCreatedAt();
        userResponse.setUpdatedAt();
        return userResponse;

        if (repository.existsById(request.getEmail())){
            throw new RuntimeException("Email already exist");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFullName(request.getLastName());
        user.setLastName(request.getLastName());

        User savedUser = repository.save(user);
        UserResponse userResponse = new UserResponse();
        userResponse.setId(savedUser.getId());
        userResponse.setPassword(savedUser.getPassword());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFullName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpadatedAt(savedUser.getUpdatedAt());

        return userResponse;

    }
    public UserResponse getUserProfile(String userId){
        User user = (User) repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setPassword(user.getPassword());
        userResponse.setEmail(user.getEmail());
        userResponse.setFullName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpadatedAt(user.getUpdatedAt());

        return userResponse;


    }
}
