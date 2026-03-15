package com.fittrack.stats.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_summaries",
    uniqueConstraints = @UniqueConstraint(columnNames = {"username", "summary_date"}),
    indexes = @Index(name = "idx_summary_user_date", columnList = "username,summary_date"))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DailySummary {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(name = "summary_date", nullable = false)
    private LocalDate summaryDate;

    // Diet aggregates
    private Double totalCalories = 0.0;
    private Double totalProtein = 0.0;
    private Double totalCarbs = 0.0;
    private Double totalFat = 0.0;

    // Workout aggregates
    private Integer caloriesBurned = 0;
    private Integer workoutMinutes = 0;
    private Integer workoutCount = 0;

    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
