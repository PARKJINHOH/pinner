package dev.pinner.repository;

import dev.pinner.domain.entity.Travel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelRepository extends JpaRepository<Travel, Long>, TravelRepositoryCustom {
}
