package com.example.travelmaprecodebe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class TravelmaprecodeBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelmaprecodeBeApplication.class, args);
    }

}
