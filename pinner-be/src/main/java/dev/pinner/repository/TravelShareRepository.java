package dev.pinner.repository;

import dev.pinner.domain.entity.TravelShareInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TravelShareRepository extends JpaRepository<TravelShareInfo, Long> {
    Optional<TravelShareInfo> findByShareCode(String shareCode);
}
