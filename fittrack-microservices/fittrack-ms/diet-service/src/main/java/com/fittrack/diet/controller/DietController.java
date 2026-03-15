package com.fittrack.diet.controller;

import com.fittrack.diet.dto.DietDto;
import com.fittrack.diet.service.DietService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {

    private final DietService svc;

    @PostMapping
    public ResponseEntity<DietDto.DietResponse> create(
            @RequestHeader("X-Auth-User") String username,
            @RequestBody DietDto.DietRequest req) {
        return ResponseEntity.ok(svc.create(username, req));
    }

    @GetMapping
    public ResponseEntity<List<DietDto.DietResponse>> getByDate(
            @RequestHeader("X-Auth-User") String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(svc.getByDate(username, date != null ? date : LocalDate.now()));
    }

    @GetMapping("/range")
    public ResponseEntity<List<DietDto.DietResponse>> getByRange(
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
