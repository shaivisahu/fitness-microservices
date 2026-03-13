package com.fitness.workoutservice.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "workouts")
@Data
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String title;

    private String type;
    private Integer durationMinutes;
    private Integer caloriesBurned;
    private String notes;

    @Enumerated(EnumType.STRING)
    private WorkoutStatus status = WorkoutStatus.COMPLETED;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "workout_id")
    private List<Exercise> exercises;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
