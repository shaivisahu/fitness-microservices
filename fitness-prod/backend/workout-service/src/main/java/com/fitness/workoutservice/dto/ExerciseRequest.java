package com.fitness.workoutservice.dto;

import lombok.Data;

@Data
public class ExerciseRequest {
    private String name;
    private Integer sets;
    private Integer reps;
    private Double weightKg;
    private Integer durationSeconds;
    private String muscleGroup;
}
