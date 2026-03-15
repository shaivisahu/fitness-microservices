package com.fittrack.workout.dto;

import com.fittrack.workout.entity.WorkoutLog;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

public class WorkoutDto {

    @Data public static class ExerciseDto {
        private Long id;
        private String name, notes;
        private Integer sets, reps, durationSeconds;
        private Double weight, distanceKm;
    }

    @Data public static class WorkoutRequest {
        private String workoutName, notes;
        private WorkoutLog.WorkoutType workoutType;
        private LocalDate workoutDate;
        private Integer durationMinutes, caloriesBurned;
        private List<ExerciseDto> exercises;
    }

    @Data public static class WorkoutResponse {
        private Long id;
        private String workoutName, notes, username;
        private WorkoutLog.WorkoutType workoutType;
        private LocalDate workoutDate;
        private Integer durationMinutes, caloriesBurned;
        private List<ExerciseDto> exercises;
    }

    @Data public static class WorkoutEvent {
        private String username;
        private LocalDate date;
        private Integer caloriesBurned, durationMinutes;
        private WorkoutLog.WorkoutType workoutType;
    }
}
