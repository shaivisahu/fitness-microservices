package com.fittrack.workout.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "exercises")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Exercise {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_log_id", nullable = false)
    private WorkoutLog workoutLog;

    @Column(nullable = false) private String name;
    private Integer sets, reps, durationSeconds;
    private Double weight, distanceKm;
    private String notes;
}
