package com.fitness.workoutservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class WorkoutRequest {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Title is required")
    private String title;

    private String type;
    private Integer durationMinutes;
    private Integer caloriesBurned;
    private String notes;
    private List<ExerciseRequest> exercises;
}
