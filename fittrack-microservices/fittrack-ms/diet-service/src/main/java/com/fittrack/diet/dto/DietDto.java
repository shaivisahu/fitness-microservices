package com.fittrack.diet.dto;

import com.fittrack.diet.entity.DietEntry;
import lombok.Data;
import java.time.LocalDate;

public class DietDto {

    @Data public static class DietRequest {
        private String foodName, servingUnit;
        private LocalDate entryDate;
        private DietEntry.MealType mealType;
        private Double calories, protein, carbohydrates, fat, fiber, servingSize;
    }

    @Data public static class DietResponse {
        private Long id;
        private String foodName, servingUnit, username;
        private LocalDate entryDate;
        private DietEntry.MealType mealType;
        private Double calories, protein, carbohydrates, fat, fiber, servingSize;
    }

    @Data public static class DietEvent {
        private String username;
        private LocalDate date;
        private Double calories, protein, carbohydrates, fat;
    }
}
