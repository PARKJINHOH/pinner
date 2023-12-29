package dev.pinner.repository;

import dev.pinner.domain.entity.SysLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SysLogRepository extends JpaRepository<SysLog, Long> {
}
