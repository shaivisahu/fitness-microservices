package com.fitness.workoutservice.repository;

import com.fitness.workoutservice.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, String> {
    List<Workout> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByUserId(String userId);
}
