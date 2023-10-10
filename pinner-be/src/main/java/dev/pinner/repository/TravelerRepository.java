package dev.pinner.repository;


import dev.pinner.domain.entity.Traveler;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TravelerRepository extends JpaRepository<Traveler, Long>, TravelerRepositoryCustom {
    Optional<Traveler> findByEmail(String email);
    Optional<Traveler> findByNickname(String nickname);
}
