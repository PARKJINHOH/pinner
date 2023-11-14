package dev.pinner.service;

import dev.pinner.domain.dto.EmailSMTPDto;
import dev.pinner.domain.entity.EmailSMTP;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.global.enums.EmailSmtpEnum;
import dev.pinner.repository.EmailSmtpRepository;
import dev.pinner.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailService {

    // EmailConfig Bean 설정
    private final JavaMailSender javaMailSender;
    private final EmailSmtpRepository emailSmtpRepository;
    private final TravelerRepository travelerRepository;

    @Value("${spring.mail.username}")
    public String sendEmail;

    /**
     * 이메일 발송
     */
    @Transactional
    public boolean sendMail(EmailSMTPDto.Request emailSmtpDto) throws Exception {

        String randomCode = generateRandomCode(emailSmtpDto.getEmail());

        // 이메일 발송 세팅
        EmailSMTP emailMessage = EmailSMTP.builder()
                .recipient(emailSmtpDto.getEmail())
                .subject(emailSmtpDto.getSubject())
                .message(emailSmtpDto.getMessage() + randomCode)
                .code(randomCode)
                .emailType(emailSmtpDto.getEmailType())
                .build();

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
        mimeMessageHelper.setFrom(sendEmail); // 발신자
        mimeMessageHelper.setTo(emailMessage.getRecipient()); // 수신자
        mimeMessageHelper.setSubject(emailMessage.getSubject()); // 메일 제목
        mimeMessageHelper.setText(emailMessage.getMessage(), true); // 메일 본문 내용, HTML 여부

        if(emailSmtpDto.getEmailType().equals(EmailSmtpEnum.TEMPORARY_PASSWORD.getType())){
            // 임시 비밀번호 저장
            Optional<Traveler> getTraveler = travelerRepository.findByEmail(emailSmtpDto.getEmail());
            if (getTraveler.isPresent()) {
                if (!getTraveler.get().getNickname().equals(emailSmtpDto.getNickname())) {
                    return false;
                }
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            boolean isChangePassword = travelerRepository.updateTravelerPasswordByTravelerEmail(emailSmtpDto.getEmail(), encoder.encode(randomCode));
            if (!isChangePassword) {
                return false;
            }
        }

        // 이메일 전송
        javaMailSender.send(mimeMessage);

        emailSmtpRepository.save(emailMessage);
        log.info("{} : Email Send Success", emailSmtpDto.getEmail());

        return true;

    }

    public boolean emailCheck(EmailSMTPDto.Request emailSmtpDto) {
        Optional<EmailSMTP> getFindCode = emailSmtpRepository.findByCode(emailSmtpDto.getEmailCode());

        if (getFindCode.isPresent()) {
            EmailSMTP emailSMTP = getFindCode.get();
            LocalDateTime createdDate = emailSMTP.getCreatedDate();

            // 현재 시간과 비교하여 3분이 지났는지 체크
            LocalDateTime currentTime = LocalDateTime.now();
            if (createdDate.isBefore(currentTime.minusMinutes(3))) {
                return false;
            }
        }

        return getFindCode.map(emailSMTP ->
                emailSMTP.getRecipient().equals(emailSmtpDto.getEmail())).orElse(false);
    }



    /**
     * 회원가입 - 이메일 인증 코드 생성
     */
    private String generateRandomCode(String email) {
        final int CODE_LENGTH = 12;

        StringBuilder code = new StringBuilder();

        Random random = new Random();
        for (int i = 0; i < CODE_LENGTH; i++) {
            char randomChar = email.charAt(random.nextInt(email.length()));
            code.append(randomChar);
        }

        return code.toString();
    }
}
