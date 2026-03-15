package com.fittrack.diet.repository;

import com.fittrack.diet.entity.DietEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DietEntryRepository extends JpaRepository<DietEntry, Long> {
    List<DietEntry> findByUsernameAndEntryDateOrderByCreatedAtDesc(String username, LocalDate date);
    List<DietEntry> findByUsernameAndEntryDateBetweenOrderByEntryDateDesc(String username, LocalDate s, LocalDate e);

    @Query("SELECT SUM(d.calories) FROM DietEntry d WHERE d.username=:username AND d.entryDate=:date")
    Double sumCaloriesByDate(String username, LocalDate date);

    @Query("SELECT SUM(d.protein) FROM DietEntry d WHERE d.username=:username AND d.entryDate=:date")
    Double sumProteinByDate(String username, LocalDate date);

    @Query("SELECT SUM(d.carbohydrates) FROM DietEntry d WHERE d.username=:username AND d.entryDate=:date")
    Double sumCarbsByDate(String username, LocalDate date);

    @Query("SELECT SUM(d.fat) FROM DietEntry d WHERE d.username=:username AND d.entryDate=:date")
    Double sumFatByDate(String username, LocalDate date);
}
