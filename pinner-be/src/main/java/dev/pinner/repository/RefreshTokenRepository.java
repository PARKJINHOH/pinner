package dev.pinner.repository;

import dev.pinner.domain.entity.RefreshToken;
import dev.pinner.domain.entity.Traveler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    int deleteByTraveler(Traveler traveler);
}
