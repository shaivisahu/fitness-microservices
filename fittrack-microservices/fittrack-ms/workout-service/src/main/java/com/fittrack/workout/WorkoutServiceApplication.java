package com.fittrack.workout;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableDiscoveryClient
@EnableKafka
public class WorkoutServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorkoutServiceApplication.class, args);
    }
}
