package dev.pinner.controller;

import dev.pinner.domain.dto.EmailSMTPDto;
import dev.pinner.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<?> sendJoinMail(EmailSMTPDto.Request request) {
        try {
            String randomCode = emailService.sendMail(request);

            if (randomCode == null) {
                return ResponseEntity.internalServerError().body("이메일 발송에 실패했습니다.");
            }

            return ResponseEntity.ok().body(randomCode);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("이메일 발송에 실패했습니다.");
        }
    }

}
