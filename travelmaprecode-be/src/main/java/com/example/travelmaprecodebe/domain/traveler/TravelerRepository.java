package com.example.travelmaprecodebe.domain.traveler;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TravelerRepository extends JpaRepository<Traveler, Long> {
    Optional<Traveler> findByEmail(String email);

    Traveler findMemberByEmail(String email);
}
