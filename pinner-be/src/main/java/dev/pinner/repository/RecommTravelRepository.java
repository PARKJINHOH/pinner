package dev.pinner.repository;

import dev.pinner.domain.entity.Notice;
import dev.pinner.domain.entity.RecommTravel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommTravelRepository extends JpaRepository<RecommTravel, Long> {
}
