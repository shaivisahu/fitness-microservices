package com.fittrack.stats.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

public class StatsDto {

    @Data public static class DashboardStats {
        private Double todayCaloriesConsumed;
        private Integer todayCaloriesBurned;
        private Long totalWorkouts;
        private Double todayProtein;
        private Double todayCarbs;
        private Double todayFat;
        private Integer weeklyWorkoutMinutes;
    }

    @Data public static class ProgressPoint {
        private LocalDate date;
        private Double calories;
        private Double protein;
        private Integer caloriesBurned;
        private Integer workoutMinutes;
    }

    // Incoming Kafka event shapes (mirrors what Workout/Diet services publish)
    @Data public static class WorkoutEvent {
        private String username;
        private LocalDate date;
        private Integer caloriesBurned;
        private Integer durationMinutes;
        private String workoutType;
    }

    @Data public static class DietEvent {
        private String username;
        private LocalDate date;
        private Double calories;
        private Double protein;
        private Double carbohydrates;
        private Double fat;
    }
}
