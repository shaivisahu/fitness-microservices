package com.fittrack.stats.controller;

import com.fittrack.stats.dto.StatsDto;
import com.fittrack.stats.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService svc;

    @GetMapping("/dashboard")
    public ResponseEntity<StatsDto.DashboardStats> dashboard(
            @RequestHeader("X-Auth-User") String username) {
        return ResponseEntity.ok(svc.getDashboard(username));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<StatsDto.ProgressPoint>> progress(
            @RequestHeader("X-Auth-User") String username,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(svc.getProgress(username, days));
    }
}
