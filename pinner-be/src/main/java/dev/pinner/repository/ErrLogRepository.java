package dev.pinner.repository;

import dev.pinner.domain.entity.ErrLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ErrLogRepository extends JpaRepository<ErrLog, Long> {
}
