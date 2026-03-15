package com.fittrack.ai.service;

import com.fittrack.ai.config.RateLimiter;
import com.fittrack.ai.dto.AiDto;
import com.fittrack.ai.entity.AiSuggestion;
import com.fittrack.ai.repository.AiSuggestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final AiSuggestionRepository repo;
    private final RateLimiter rateLimiter;
    private final WebClient.Builder webClientBuilder;

    @Value("${anthropic.api.key}")   private String apiKey;
    @Value("${anthropic.api.url}")   private String apiUrl;
    @Value("${anthropic.api.model}") private String model;
    @Value("${anthropic.api.max-tokens}") private int maxTokens;

    @Async("aiTaskExecutor")
    public CompletableFuture<AiDto.AiResponse> generate(String username, AiDto.AiRequest req) {

        if (!rateLimiter.allow(username)) {
            throw new RuntimeException("AI rate limit reached — 20 requests per hour max.");
        }

        String context = req.getUserContext() != null ? req.getUserContext() : "No context provided.";
        String prompt  = buildPrompt(req, context);
        String content = callAnthropic(prompt);

        AiSuggestion saved = repo.save(AiSuggestion.builder()
                .username(username)
                .type(req.getType() != null ? req.getType() : AiSuggestion.SuggestionType.GENERAL)
                .content(content)
                .contextSummary(context.substring(0, Math.min(400, context.length())))
                .build());

        return CompletableFuture.completedFuture(toDto(saved, rateLimiter.remaining(username)));
    }

    public List<AiDto.AiResponse> history(String username) {
        return repo.findByUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(s -> toDto(s, rateLimiter.remaining(username)))
                .collect(Collectors.toList());
    }

    // ── Private helpers ───────────────────────────────────────────

    private String buildPrompt(AiDto.AiRequest req, String context) {
        String typeInstruction = switch (
                req.getType() != null ? req.getType() : AiSuggestion.SuggestionType.GENERAL) {
            case WORKOUT_PLAN -> "Generate a personalised weekly workout plan. Include exercises, sets, reps, rest periods, and progressive overload suggestions.";
            case NUTRITION_ADVICE -> "Analyse their nutrition and give specific dietary advice. Include macro targets, meal timing, and food swaps.";
            case RECOVERY_TIP -> "Give targeted recovery advice based on their training load. Cover sleep, stretching, active recovery, and overtraining signs.";
            case PROGRESS_ANALYSIS -> "Analyse their overall progress. Celebrate wins, highlight weak areas, and set 30-day goals.";
            default -> req.getCustomPrompt() != null ? req.getCustomPrompt() : "Give personalised fitness coaching advice.";
        };

        return String.format("""
                You are an expert personal fitness coach and nutritionist. Analyse this data and give highly personalised, actionable advice.

                TASK: %s

                USER DATA:
                %s

                RULES:
                - Be specific — reference their actual numbers
                - Use emoji section headers for readability
                - Keep it under 400 words
                - End with 3 specific action items for this week
                """, typeInstruction, context);
    }

    @SuppressWarnings("unchecked")
    private String callAnthropic(String prompt) {
        try {
            WebClient client = webClientBuilder.baseUrl("https://api.anthropic.com").build();

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("max_tokens", maxTokens);
            body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

            Map<String, Object> response = client.post()
                    .uri("/v1/messages")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("content")) {
                List<Map<String, Object>> contentList = (List<Map<String, Object>>) response.get("content");
                if (!contentList.isEmpty()) return (String) contentList.get(0).get("text");
            }
            return "Unable to generate suggestion. Please try again.";
        } catch (Exception e) {
            log.error("Anthropic API error: {}", e.getMessage());
            throw new RuntimeException("AI service temporarily unavailable.");
        }
    }

    private AiDto.AiResponse toDto(AiSuggestion s, int remaining) {
        var r = new AiDto.AiResponse();
        r.setId(s.getId()); r.setType(s.getType());
        r.setContent(s.getContent()); r.setContextSummary(s.getContextSummary());
        r.setCreatedAt(s.getCreatedAt()); r.setRemainingRequests(remaining);
        return r;
    }
}
