package dev.pinner.service;

import dev.pinner.domain.dto.EmailSMTPDto;
import dev.pinner.domain.entity.EmailSMTP;
import dev.pinner.global.enums.EmailSmtpEnum;
import dev.pinner.repository.EmailSmtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.internet.MimeMessage;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailService {

    // EmailConfig Bean 설정
    private final JavaMailSender javaMailSender;
    private final EmailSmtpRepository emailSmtpRepository;

    @Value("${spring.mail.username}")
    public String sendEmail;

    /**
     * 회원가입 - 이메일 인증 코드 발송
     * @param emailSmtpDto
     */
    public boolean sendMail(EmailSMTPDto.Request emailSmtpDto) {
        String randomCode = generateRandomCode(emailSmtpDto.getEmail());

        try {

            EmailSMTP emailMessage = EmailSMTP.builder()
                    .to(emailSmtpDto.getEmail())
                    .subject("[Pinner] 이메일 인증을 위한 인증 코드 발송")
                    .message("이메일 인증 코드 입니다 : " + randomCode)
                    .code(randomCode)
                    .type(EmailSmtpEnum.EMAIL_CERTIFIED.getType())
                    .build();

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setFrom(sendEmail); // 발신자
            mimeMessageHelper.setTo(emailMessage.getTo()); // 수신자
            mimeMessageHelper.setSubject(emailMessage.getSubject()); // 메일 제목
            mimeMessageHelper.setText(emailMessage.getMessage(), true); // 메일 본문 내용, HTML 여부

            // 이메일 전송
            javaMailSender.send(mimeMessage);

            emailSmtpRepository.save(emailMessage);

            log.info("{} : Email Send Success", emailSmtpDto.getEmail());

            return true;

        } catch (Exception e) {
            log.error("{} : Email Send Fail : {}", emailSmtpDto.getEmail(), e.getMessage());
            return false;
        }

    }

    /**
     * 회원가입 - 이메일 인증 확인
     * @param emailSmtpDto
     * @return
     */
    public boolean emailCheck(EmailSMTPDto.Request emailSmtpDto) {
        Optional<EmailSMTP> getFindCode = emailSmtpRepository.findByCode(emailSmtpDto.getEmailCode());

        return getFindCode.map(emailSMTP ->
                emailSMTP.getTo().equals(emailSmtpDto.getEmail())).orElse(false);
    }



    /**
     * 회원가입 - 이메일 인증 코드 생성
     * @param email
     * @return
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
