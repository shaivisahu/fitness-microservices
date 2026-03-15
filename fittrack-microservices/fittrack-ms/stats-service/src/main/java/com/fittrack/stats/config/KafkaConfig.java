package com.fittrack.stats.config;

import com.fittrack.stats.dto.StatsDto;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    private Map<String, Object> baseConsumerProps() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "stats-group");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return props;
    }

    @Bean
    public ConsumerFactory<String, StatsDto.WorkoutEvent> workoutConsumerFactory() {
        Map<String, Object> props = baseConsumerProps();
        JsonDeserializer<StatsDto.WorkoutEvent> deser = new JsonDeserializer<>(StatsDto.WorkoutEvent.class, false);
        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deser);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, StatsDto.WorkoutEvent> workoutKafkaListenerContainerFactory() {
        var factory = new ConcurrentKafkaListenerContainerFactory<String, StatsDto.WorkoutEvent>();
        factory.setConsumerFactory(workoutConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, StatsDto.DietEvent> dietConsumerFactory() {
        Map<String, Object> props = baseConsumerProps();
        JsonDeserializer<StatsDto.DietEvent> deser = new JsonDeserializer<>(StatsDto.DietEvent.class, false);
        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deser);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, StatsDto.DietEvent> dietKafkaListenerContainerFactory() {
        var factory = new ConcurrentKafkaListenerContainerFactory<String, StatsDto.DietEvent>();
        factory.setConsumerFactory(dietConsumerFactory());
        return factory;
    }
}
