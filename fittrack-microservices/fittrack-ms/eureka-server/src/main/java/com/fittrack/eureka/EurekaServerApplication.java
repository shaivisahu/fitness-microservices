package com.fittrack.eureka;

import org.springframework.boot.SpringApplication;git add gateway user-service
        git commit -m "feat: integrate Keycloak authentication with JWT and secure API gateway routes"
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
