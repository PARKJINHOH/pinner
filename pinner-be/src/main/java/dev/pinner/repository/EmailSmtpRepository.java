package dev.pinner.repository;

import dev.pinner.domain.entity.EmailSMTP;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailSmtpRepository extends JpaRepository<EmailSMTP, Long> {
}
