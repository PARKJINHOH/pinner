package dev.pinner.repository;

import dev.pinner.domain.entity.Community;
import dev.pinner.domain.entity.RecommTravel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityRepository extends JpaRepository<Community, Long> {
}
