package dev.pinner.repository;

import dev.pinner.domain.entity.Log;
import dev.pinner.domain.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LogsRepository extends JpaRepository<Log, Long> {
}
