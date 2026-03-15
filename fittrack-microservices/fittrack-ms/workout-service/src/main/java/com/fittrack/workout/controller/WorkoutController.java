package com.fittrack.workout.controller;

import com.fittrack.workout.dto.WorkoutDto;
import com.fittrack.workout.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService svc;

    @PostMapping
    public ResponseEntity<WorkoutDto.WorkoutResponse> create(
            @RequestHeader("X-Auth-User") String username,
            @RequestBody WorkoutDto.WorkoutRequest req) {
        return ResponseEntity.ok(svc.create(username, req));
    }

    @GetMapping
    public ResponseEntity<List<WorkoutDto.WorkoutResponse>> getAll(
            @RequestHeader("X-Auth-User") String username) {
        return ResponseEntity.ok(svc.getAll(username));
    }

    @GetMapping("/range")
    public ResponseEntity<List<WorkoutDto.WorkoutResponse>> getByRange(
            @RequestHeader("X-Auth-User") String username,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(svc.getByRange(username, start, end));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("X-Auth-User") String username,
            @PathVariable Long id) {
        svc.delete(username, id);
        return ResponseEntity.noContent().build();
    }
}
