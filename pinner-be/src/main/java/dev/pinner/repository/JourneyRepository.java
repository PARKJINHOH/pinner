package dev.pinner.repository;

import dev.pinner.domain.entity.Journey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JourneyRepository extends JpaRepository<Journey, Long>, JourneyRepositoryCustom {
}
