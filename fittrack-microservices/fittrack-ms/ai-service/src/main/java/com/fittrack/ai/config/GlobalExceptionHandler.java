package com.fittrack.ai.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,String>> handle(RuntimeException ex) {
        int status = ex.getMessage() != null && ex.getMessage().contains("rate limit") ? 429 : 400;
        return ResponseEntity.status(status).body(Map.of("message", ex.getMessage()));
    }
}
