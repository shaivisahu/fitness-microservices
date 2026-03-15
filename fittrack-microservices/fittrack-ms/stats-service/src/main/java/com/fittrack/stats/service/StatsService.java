package com.fittrack.stats.service;

import com.fittrack.stats.dto.StatsDto;
import com.fittrack.stats.entity.DailySummary;
import com.fittrack.stats.repository.DailySummaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatsService {

    private final DailySummaryRepository repo;

    // ── Kafka Consumers ───────────────────────────────────────────

    @KafkaListener(topics = "workout.logged", groupId = "stats-group",
            containerFactory = "workoutKafkaListenerContainerFactory")
    @Transactional
    public void consumeWorkoutEvent(StatsDto.WorkoutEvent event) {
        log.info("Received workout event for user: {} on {}", event.getUsername(), event.getDate());
        LocalDate date = event.getDate() != null ? event.getDate() : LocalDate.now();
        DailySummary summary = getOrCreate(event.getUsername(), date);
        if (event.getCaloriesBurned() != null) summary.setCaloriesBurned(summary.getCaloriesBurned() + event.getCaloriesBurned());
        if (event.getDurationMinutes() != null) summary.setWorkoutMinutes(summary.getWorkoutMinutes() + event.getDurationMinutes());
        summary.setWorkoutCount(summary.getWorkoutCount() + 1);
        repo.save(summary);
    }

    @KafkaListener(topics = "diet.updated", groupId = "stats-group",
            containerFactory = "dietKafkaListenerContainerFactory")
    @Transactional
    public void consumeDietEvent(StatsDto.DietEvent event) {
        log.info("Received diet event for user: {} on {}", event.getUsername(), event.getDate());
        LocalDate date = event.getDate() != null ? event.getDate() : LocalDate.now();
        DailySummary summary = getOrCreate(event.getUsername(), date);
        if (event.getCalories() != null) summary.setTotalCalories(summary.getTotalCalories() + event.getCalories());
        if (event.getProtein() != null) summary.setTotalProtein(summary.getTotalProtein() + event.getProtein());
        if (event.getCarbohydrates() != null) summary.setTotalCarbs(summary.getTotalCarbs() + event.getCarbohydrates());
        if (event.getFat() != null) summary.setTotalFat(summary.getTotalFat() + event.getFat());
        repo.save(summary);
    }

    // ── Query Methods ─────────────────────────────────────────────

    public StatsDto.DashboardStats getDashboard(String username) {
        LocalDate today = LocalDate.now();
        DailySummary todaySummary = repo.findByUsernameAndSummaryDate(username, today)
                .orElse(emptyDailySummary(username, today));

        StatsDto.DashboardStats stats = new StatsDto.DashboardStats();
        stats.setTodayCaloriesConsumed(todaySummary.getTotalCalories());
        stats.setTodayCaloriesBurned(todaySummary.getCaloriesBurned());
        stats.setTodayProtein(todaySummary.getTotalProtein());
        stats.setTodayCarbs(todaySummary.getTotalCarbs());
        stats.setTodayFat(todaySummary.getTotalFat());
        stats.setTotalWorkouts(repo.countWorkoutDaysByUsername(username));

        Integer weeklyMins = repo.sumWorkoutMinutesByRange(username, today.minusDays(6), today);
        stats.setWeeklyWorkoutMinutes(weeklyMins != null ? weeklyMins : 0);

        return stats;
    }

    public List<StatsDto.ProgressPoint> getProgress(String username, int days) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days - 1);
        List<DailySummary> summaries = repo.findByUsernameAndSummaryDateBetweenOrderBySummaryDateAsc(username, start, end);

        // Build a map so missing days get zero-filled
        java.util.Map<LocalDate, DailySummary> byDate = new java.util.HashMap<>();
        for (DailySummary s : summaries) byDate.put(s.getSummaryDate(), s);

        List<StatsDto.ProgressPoint> result = new ArrayList<>();
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            DailySummary s = byDate.getOrDefault(d, emptyDailySummary(username, d));
            StatsDto.ProgressPoint pt = new StatsDto.ProgressPoint();
            pt.setDate(d);
            pt.setCalories(s.getTotalCalories());
            pt.setProtein(s.getTotalProtein());
            pt.setCaloriesBurned(s.getCaloriesBurned());
            pt.setWorkoutMinutes(s.getWorkoutMinutes());
            result.add(pt);
        }
        return result;
    }

    // ── Helpers ───────────────────────────────────────────────────

    private DailySummary getOrCreate(String username, LocalDate date) {
        return repo.findByUsernameAndSummaryDate(username, date)
                .orElse(DailySummary.builder()
                        .username(username).summaryDate(date)
                        .totalCalories(0.0).totalProtein(0.0).totalCarbs(0.0).totalFat(0.0)
                        .caloriesBurned(0).workoutMinutes(0).workoutCount(0)
                        .build());
    }

    private DailySummary emptyDailySummary(String username, LocalDate date) {
        return DailySummary.builder()
                .username(username).summaryDate(date)
                .totalCalories(0.0).totalProtein(0.0).totalCarbs(0.0).totalFat(0.0)
                .caloriesBurned(0).workoutMinutes(0).workoutCount(0)
                .build();
    }
}
