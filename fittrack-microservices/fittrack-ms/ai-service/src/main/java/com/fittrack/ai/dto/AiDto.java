package com.fittrack.ai.dto;

import com.fittrack.ai.entity.AiSuggestion;
import lombok.Data;
import java.time.LocalDateTime;

public class AiDto {

    @Data public static class AiRequest {
        private AiSuggestion.SuggestionType type;
        private String customPrompt;
        // Context passed from the frontend (pre-fetched from stats/workout/diet services)
        private String userContext;
    }

    @Data public static class AiResponse {
        private Long id;
        private AiSuggestion.SuggestionType type;
        private String content;
        private String contextSummary;
        private LocalDateTime createdAt;
        private int remainingRequests;
    }
}
