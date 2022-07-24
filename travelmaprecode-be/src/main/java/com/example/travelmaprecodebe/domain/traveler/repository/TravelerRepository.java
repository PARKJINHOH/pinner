package com.example.travelmaprecodebe.domain.traveler.repository;


import com.example.travelmaprecodebe.domain.traveler.TravelerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TravelerRepository extends JpaRepository<TravelerEntity, Long> {
    Optional<TravelerEntity> findByEmail(String email);

}
