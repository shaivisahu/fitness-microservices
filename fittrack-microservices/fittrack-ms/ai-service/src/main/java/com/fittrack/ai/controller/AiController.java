package com.fittrack.ai.controller;

import com.fittrack.ai.dto.AiDto;
import com.fittrack.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService svc;

    @PostMapping("/suggest")
    public CompletableFuture<ResponseEntity<AiDto.AiResponse>> suggest(
            @RequestHeader("X-Auth-User") String username,
            @RequestBody AiDto.AiRequest req) {
        return svc.generate(username, req).thenApply(ResponseEntity::ok);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AiDto.AiResponse>> history(
            @RequestHeader("X-Auth-User") String username) {
        return ResponseEntity.ok(svc.history(username));
    }
}
