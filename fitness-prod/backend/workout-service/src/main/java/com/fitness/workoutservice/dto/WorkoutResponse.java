package com.fitness.workoutservice.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class WorkoutResponse {
    private String id;
    private String userId;
    private String title;
    private String type;
    private Integer durationMinutes;
    private Integer caloriesBurned;
    private String notes;
    private String status;
    private List<ExerciseRequest> exercises;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
