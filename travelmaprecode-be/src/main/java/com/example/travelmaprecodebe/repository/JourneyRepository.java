package com.example.travelmaprecodebe.repository;

import com.example.travelmaprecodebe.domain.entity.Journey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JourneyRepository extends JpaRepository<Journey, Long> {
}
