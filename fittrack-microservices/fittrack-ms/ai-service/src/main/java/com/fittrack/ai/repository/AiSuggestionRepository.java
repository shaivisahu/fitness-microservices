package com.fittrack.ai.repository;

import com.fittrack.ai.entity.AiSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiSuggestionRepository extends JpaRepository<AiSuggestion, Long> {
    List<AiSuggestion> findByUsernameOrderByCreatedAtDesc(String username);


    List<AiSuggestion> findTop5ByUsernameOrderByCreatedAtDesc(String username);
}
