package com.fittrack.workout.repository;

import com.fittrack.workout.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByUsernameOrderByWorkoutDateDesc(String username);
    List<WorkoutLog> findByUsernameAndWorkoutDateBetweenOrderByWorkoutDateDesc(String username, LocalDate s, LocalDate e);

    @Query("SELECT SUM(w.caloriesBurned) FROM WorkoutLog w WHERE w.username=:username AND w.workoutDate=:date")
    Integer sumCaloriesBurnedByDate(String username, LocalDate date);

    @Query("SELECT SUM(w.durationMinutes) FROM WorkoutLog w WHERE w.username=:username AND w.workoutDate BETWEEN :s AND :e")
    Integer sumDurationByRange(String username, LocalDate s, LocalDate e);

    long countByUsername(String username);
}
