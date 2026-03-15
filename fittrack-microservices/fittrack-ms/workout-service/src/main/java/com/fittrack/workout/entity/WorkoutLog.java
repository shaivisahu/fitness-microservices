package com.fittrack.workout.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "workout_logs", indexes = {
    @Index(name = "idx_workout_user_date", columnList = "username,workout_date")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkoutLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

    @Column(nullable = false) private String username;
    @Column(nullable = false) private String workoutName;

    @Enumerated(EnumType.STRING)
    private WorkoutType workoutType;

    private LocalDate workoutDate;
    private Integer durationMinutes;
    private Integer caloriesBurned;
    private String notes;

    @OneToMany(mappedBy = "workoutLog", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Exercise> exercises;

    @Column(updatable = false) private LocalDateTime createdAt;

    @PrePersist protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (workoutDate == null) workoutDate = LocalDate.now();
    }

    public enum WorkoutType { STRENGTH, CARDIO, FLEXIBILITY, HIIT, YOGA, SPORTS, OTHER }
}
