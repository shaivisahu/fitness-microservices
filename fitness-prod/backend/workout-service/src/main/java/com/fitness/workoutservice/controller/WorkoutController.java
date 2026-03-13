package com.fitness.workoutservice.controller;

import com.fitness.workoutservice.dto.*;
import com.fitness.workoutservice.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@AllArgsConstructor
@Tag(name = "Workout Service", description = "Log and manage workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    @Operation(summary = "Log a new workout")
    @PostMapping
    public ResponseEntity<WorkoutResponse> logWorkout(@Valid @RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(workoutService.logWorkout(request));
    }

    @Operation(summary = "Get all workouts for a user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutResponse>> getUserWorkouts(@PathVariable String userId) {
        return ResponseEntity.ok(workoutService.getUserWorkouts(userId));
    }

    @Operation(summary = "Get a single workout by ID")
    @GetMapping("/{workoutId}")
    public ResponseEntity<WorkoutResponse> getWorkout(@PathVariable String workoutId) {
        return ResponseEntity.ok(workoutService.getWorkoutById(workoutId));
    }

    @Operation(summary = "Delete a workout")
    @DeleteMapping("/{workoutId}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable String workoutId) {
        workoutService.deleteWorkout(workoutId);
        return ResponseEntity.noContent().build();
    }
}
