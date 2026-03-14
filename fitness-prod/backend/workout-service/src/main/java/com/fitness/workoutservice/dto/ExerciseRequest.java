package com.fitness.workoutservice.dto;

public class ExerciseRequest {
    private String name;
    private Integer sets;
    private Integer reps;
    private Double weightKg;
    private Integer durationSeconds;
    private String muscleGroup;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }
    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }
}
