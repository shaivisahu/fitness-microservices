package com.fitness.workoutservice.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

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

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Integer getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<ExerciseRequest> getExercises() { return exercises; }
    public void setExercises(List<ExerciseRequest> exercises) { this.exercises = exercises; }
}
