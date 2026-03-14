package com.fitness.workoutservice.service;

import com.fitness.workoutservice.dto.*;
import com.fitness.workoutservice.model.*;
import com.fitness.workoutservice.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private static final Logger log = Logger.getLogger(WorkoutService.class.getName());

    private final WorkoutRepository workoutRepository;
    private final RestTemplate restTemplate;
    private final String userServiceUrl;

    public WorkoutService(WorkoutRepository workoutRepository,
                          RestTemplate restTemplate,
                          @Value("${user.service.url}") String userServiceUrl) {
        this.workoutRepository = workoutRepository;
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
    }

    public WorkoutResponse logWorkout(WorkoutRequest request) {
        Boolean userExists = restTemplate.getForObject(
                userServiceUrl + "/api/users/" + request.getUserId() + "/validate",
                Boolean.class);
        if (Boolean.FALSE.equals(userExists)) {
            throw new RuntimeException("User not found: " + request.getUserId());
        }
        Workout workout = new Workout();
        workout.setUserId(request.getUserId());
        workout.setTitle(request.getTitle());
        workout.setType(request.getType());
        workout.setDurationMinutes(request.getDurationMinutes());
        workout.setCaloriesBurned(request.getCaloriesBurned());
        workout.setNotes(request.getNotes());

        if (request.getExercises() != null) {
            List<Exercise> exercises = request.getExercises().stream().map(e -> {
                Exercise ex = new Exercise();
                ex.setName(e.getName());
                ex.setSets(e.getSets());
                ex.setReps(e.getReps());
                ex.setWeightKg(e.getWeightKg());
                ex.setDurationSeconds(e.getDurationSeconds());
                ex.setMuscleGroup(e.getMuscleGroup());
                return ex;
            }).collect(Collectors.toList());
            workout.setExercises(exercises);
        }
        Workout saved = workoutRepository.save(workout);
        log.info("Workout logged for user: " + request.getUserId());
        return mapToResponse(saved);
    }

    public List<WorkoutResponse> getUserWorkouts(String userId) {
        return workoutRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public WorkoutResponse getWorkoutById(String workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found: " + workoutId));
        return mapToResponse(workout);
    }

    public void deleteWorkout(String workoutId) {
        if (!workoutRepository.existsById(workoutId)) {
            throw new RuntimeException("Workout not found: " + workoutId);
        }
        workoutRepository.deleteById(workoutId);
    }

    // ─── ADMIN ────────────────────────────────────────────────────
    public List<WorkoutResponse> getAllWorkouts() {
        return workoutRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private WorkoutResponse mapToResponse(Workout w) {
        WorkoutResponse r = new WorkoutResponse();
        r.setId(w.getId());
        r.setUserId(w.getUserId());
        r.setTitle(w.getTitle());
        r.setType(w.getType());
        r.setDurationMinutes(w.getDurationMinutes());
        r.setCaloriesBurned(w.getCaloriesBurned());
        r.setNotes(w.getNotes());
        r.setStatus(w.getStatus().name());
        r.setCreatedAt(w.getCreatedAt());
        r.setUpdatedAt(w.getUpdatedAt());
        if (w.getExercises() != null) {
            r.setExercises(w.getExercises().stream().map(e -> {
                ExerciseRequest er = new ExerciseRequest();
                er.setName(e.getName()); er.setSets(e.getSets()); er.setReps(e.getReps());
                er.setWeightKg(e.getWeightKg()); er.setDurationSeconds(e.getDurationSeconds());
                er.setMuscleGroup(e.getMuscleGroup());
                return er;
            }).collect(Collectors.toList()));
        }
        return r;
    }
}
