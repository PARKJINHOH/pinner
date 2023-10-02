package com.example.travelmaprecodebe.repository;


import com.example.travelmaprecodebe.domain.entity.Traveler;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TravelerRepository extends JpaRepository<Traveler, Long>, TravelerRepositoryCustom {
    Optional<Traveler> findByEmail(String email);
}
