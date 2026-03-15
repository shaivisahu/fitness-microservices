package com.fittrack.diet.service;

import com.fittrack.diet.dto.DietDto;
import com.fittrack.diet.entity.DietEntry;
import com.fittrack.diet.repository.DietEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DietService {

    private static final String TOPIC = "diet.updated";

    private final DietEntryRepository repo;
    private final KafkaTemplate<String, DietDto.DietEvent> kafkaTemplate;

    @Transactional
    public DietDto.DietResponse create(String username, DietDto.DietRequest req) {
        var entry = DietEntry.builder()
                .username(username)
                .foodName(req.getFoodName())
                .entryDate(req.getEntryDate() != null ? req.getEntryDate() : LocalDate.now())
                .mealType(req.getMealType())
                .calories(req.getCalories())
                .protein(req.getProtein())
                .carbohydrates(req.getCarbohydrates())
                .fat(req.getFat())
                .fiber(req.getFiber())
                .servingSize(req.getServingSize())
                .servingUnit(req.getServingUnit())
                .build();
        var saved = repo.save(entry);

        // Publish Kafka event for Stats service
        var event = new DietDto.DietEvent();
        event.setUsername(username);
        event.setDate(saved.getEntryDate());
        event.setCalories(saved.getCalories());
        event.setProtein(saved.getProtein());
        event.setCarbohydrates(saved.getCarbohydrates());
        event.setFat(saved.getFat());
        kafkaTemplate.send(TOPIC, username, event);
        log.info("Published diet.updated event for user: {}", username);

        return toDto(saved);
    }

    public List<DietDto.DietResponse> getByDate(String username, LocalDate date) {
        return repo.findByUsernameAndEntryDateOrderByCreatedAtDesc(username, date)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<DietDto.DietResponse> getByRange(String username, LocalDate start, LocalDate end) {
        return repo.findByUsernameAndEntryDateBetweenOrderByEntryDateDesc(username, start, end)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void delete(String username, Long id) {
        var e = repo.findById(id).orElseThrow(() -> new RuntimeException("Entry not found"));
        if (!e.getUsername().equals(username)) throw new RuntimeException("Unauthorized");
        repo.delete(e);
    }

    private DietDto.DietResponse toDto(DietEntry e) {
        var r = new DietDto.DietResponse();
        r.setId(e.getId()); r.setUsername(e.getUsername());
        r.setFoodName(e.getFoodName()); r.setEntryDate(e.getEntryDate());
        r.setMealType(e.getMealType()); r.setCalories(e.getCalories());
        r.setProtein(e.getProtein()); r.setCarbohydrates(e.getCarbohydrates());
        r.setFat(e.getFat()); r.setFiber(e.getFiber());
        r.setServingSize(e.getServingSize()); r.setServingUnit(e.getServingUnit());
        return r;
    }
}
