package com.fittrack.stats.repository;

import com.fittrack.stats.entity.DailySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailySummaryRepository extends JpaRepository<DailySummary, Long> {
    Optional<DailySummary> findByUsernameAndSummaryDate(String username, LocalDate date);
    List<DailySummary> findByUsernameAndSummaryDateBetweenOrderBySummaryDateAsc(String username, LocalDate start, LocalDate end);

    @Query("SELECT COUNT(d) FROM DailySummary d WHERE d.username = :username AND d.workoutCount > 0")
    long countWorkoutDaysByUsername(String username);

    @Query("SELECT SUM(d.workoutMinutes) FROM DailySummary d WHERE d.username = :username AND d.summaryDate BETWEEN :start AND :end")
    Integer sumWorkoutMinutesByRange(String username, LocalDate start, LocalDate end);
}
