package com.fitness.workoutservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "exercises")
@Data
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private Integer sets;
    private Integer reps;
    private Double weightKg;
    private Integer durationSeconds;
    private String muscleGroup;
}
