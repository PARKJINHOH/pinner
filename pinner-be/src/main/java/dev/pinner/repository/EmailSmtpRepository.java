package dev.pinner.repository;

import dev.pinner.domain.entity.EmailSMTP;
import dev.pinner.domain.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailSmtpRepository extends JpaRepository<EmailSMTP, Long> {
    Optional<EmailSMTP> findByCode(String fileName);

}
