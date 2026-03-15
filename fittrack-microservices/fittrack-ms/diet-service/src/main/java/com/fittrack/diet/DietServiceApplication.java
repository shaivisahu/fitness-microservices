package com.fittrack.diet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication @EnableDiscoveryClient
public class DietServiceApplication {
    public static void main(String[] args) { SpringApplication.run(DietServiceApplication.class, args); }
}
