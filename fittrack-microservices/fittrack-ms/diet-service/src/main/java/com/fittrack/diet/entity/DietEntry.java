package com.fittrack.diet.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "diet_entries", indexes = {
    @Index(name = "idx_diet_user_date", columnList = "username,entry_date")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DietEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String username;
    @Column(nullable = false) private String foodName;
    private LocalDate entryDate;
    @Enumerated(EnumType.STRING) private MealType mealType;
    private Double calories, protein, carbohydrates, fat, fiber, servingSize;
    private String servingUnit;
    @Column(updatable = false) private LocalDateTime createdAt;

    @PrePersist protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (entryDate == null) entryDate = LocalDate.now();
    }

    public enum MealType { BREAKFAST, LUNCH, DINNER, SNACK }
}
