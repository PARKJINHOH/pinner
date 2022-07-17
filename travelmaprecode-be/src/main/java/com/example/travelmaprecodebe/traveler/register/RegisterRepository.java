package com.example.travelmaprecodebe.traveler.register;


import com.example.travelmaprecodebe.traveler.TravelerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegisterRepository extends JpaRepository<TravelerEntity, Long> {
    Optional<TravelerEntity> findByEmail(String email);

}
