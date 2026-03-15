package com.fittrack.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_suggestions",
    indexes = @Index(name = "idx_ai_user_date", columnList = "username,created_at"))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AiSuggestion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Enumerated(EnumType.STRING)
    private SuggestionType type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(columnDefinition = "TEXT")
    private String contextSummary;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum SuggestionType {
        WORKOUT_PLAN, NUTRITION_ADVICE, RECOVERY_TIP, PROGRESS_ANALYSIS, GENERAL
    }
}
