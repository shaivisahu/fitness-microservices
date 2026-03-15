package com.fittrack.workout.service;

import com.fittrack.workout.dto.WorkoutDto;
import com.fittrack.workout.entity.Exercise;
import com.fittrack.workout.entity.WorkoutLog;
import com.fittrack.workout.repository.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutService {

    private static final String TOPIC = "workout.logged";

    private final WorkoutLogRepository repo;
    private final KafkaTemplate<String, WorkoutDto.WorkoutEvent> kafkaTemplate;

    @Transactional
    public WorkoutDto.WorkoutResponse create(String username, WorkoutDto.WorkoutRequest req) {
        var log = WorkoutLog.builder()
                .username(username)
                .workoutName(req.getWorkoutName())
                .workoutType(req.getWorkoutType())
                .workoutDate(req.getWorkoutDate() != null ? req.getWorkoutDate() : LocalDate.now())
                .durationMinutes(req.getDurationMinutes())
                .caloriesBurned(req.getCaloriesBurned())
                .notes(req.getNotes())
                .exercises(new ArrayList<>())
                .build();

        if (req.getExercises() != null) {
            for (var e : req.getExercises()) {
                if (e.getName() == null || e.getName().isBlank()) continue;
                log.getExercises().add(Exercise.builder()
                        .workoutLog(log).name(e.getName())
                        .sets(e.getSets()).reps(e.getReps())
                        .weight(e.getWeight()).durationSeconds(e.getDurationSeconds())
                        .distanceKm(e.getDistanceKm()).notes(e.getNotes()).build());
            }
        }

        var saved = repo.save(log);

        // Publish Kafka event for Stats service to consume
        var event = new WorkoutDto.WorkoutEvent();
        event.setUsername(username);
        event.setDate(saved.getWorkoutDate());
        event.setCaloriesBurned(saved.getCaloriesBurned());
        event.setDurationMinutes(saved.getDurationMinutes());
        event.setWorkoutType(saved.getWorkoutType());
        kafkaTemplate.send(TOPIC, username, event);
        log.info("Published workout.logged event for user: {}", username);

        return toDto(saved);
    }

    public List<WorkoutDto.WorkoutResponse> getAll(String username) {
        return repo.findByUsernameOrderByWorkoutDateDesc(username)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<WorkoutDto.WorkoutResponse> getByRange(String username, LocalDate start, LocalDate end) {
        return repo.findByUsernameAndWorkoutDateBetweenOrderByWorkoutDateDesc(username, start, end)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void delete(String username, Long id) {
        var w = repo.findById(id).orElseThrow(() -> new RuntimeException("Workout not found"));
        if (!w.getUsername().equals(username)) throw new RuntimeException("Unauthorized");
        repo.delete(w);
    }

    private WorkoutDto.WorkoutResponse toDto(WorkoutLog w) {
        var r = new WorkoutDto.WorkoutResponse();
        r.setId(w.getId()); r.setUsername(w.getUsername());
        r.setWorkoutName(w.getWorkoutName()); r.setWorkoutType(w.getWorkoutType());
        r.setWorkoutDate(w.getWorkoutDate()); r.setDurationMinutes(w.getDurationMinutes());
        r.setCaloriesBurned(w.getCaloriesBurned()); r.setNotes(w.getNotes());
        if (w.getExercises() != null) {
            r.setExercises(w.getExercises().stream().map(e -> {
                var d = new WorkoutDto.ExerciseDto();
                d.setId(e.getId()); d.setName(e.getName());
                d.setSets(e.getSets()); d.setReps(e.getReps());
                d.setWeight(e.getWeight()); d.setDurationSeconds(e.getDurationSeconds());
                d.setDistanceKm(e.getDistanceKm());
                return d;
            }).collect(Collectors.toList()));
        }
        return r;
    }
}
