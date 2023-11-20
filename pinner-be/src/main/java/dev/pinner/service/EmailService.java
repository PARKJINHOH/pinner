package dev.pinner.service;

import dev.pinner.domain.dto.EmailSMTPDto;
import dev.pinner.domain.entity.EmailSMTP;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.exception.CustomException;
import dev.pinner.global.enums.EmailSmtpEnum;
import dev.pinner.repository.EmailSmtpRepository;
import dev.pinner.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailService {

    // EmailConfig Bean 설정
    private final JavaMailSender javaMailSender;
    private final EmailSmtpRepository emailSmtpRepository;
    private final TravelerRepository travelerRepository;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    public String sendEmail;

    /**
     * 이메일 발송
     */
    @Transactional
    public boolean sendMail(EmailSMTPDto.Request emailSmtpDto) throws Exception {

        String randomCode = generateRandomCode();

        Context context = new Context();

        if(emailSmtpDto.getEmailType().equals(EmailSmtpEnum.EMAIL_CERTIFIED.getType())){
            // 회원가입 - 이메일 인증
            if (travelerRepository.findByEmail(emailSmtpDto.getEmail()).isPresent()) {
                throw new CustomException(HttpStatus.CONFLICT, "이미 등록된 이메일 주소입니다. 다른 이메일 주소를 사용해주세요.");
            }

            context.setVariable("emailTitle", "이메일 인증 코드");
            context.setVariable("emailCode", randomCode);
            String htmlContent = templateEngine.process("email-auth", context);

            emailSmtpDto.setMessage(htmlContent);
        } else if(emailSmtpDto.getEmailType().equals(EmailSmtpEnum.TEMPORARY_PASSWORD.getType())){
            // 비밀번호 찾기 - 임시 비밀번호
            Optional<Traveler> getTraveler = travelerRepository.findByEmail(emailSmtpDto.getEmail());

            if (getTraveler.isEmpty()) {
                throw new CustomException(HttpStatus.BAD_REQUEST, "등록되지 않은 이메일 입니다.");
            }
            if (!getTraveler.get().getNickname().equals(emailSmtpDto.getNickname())) {
                throw new CustomException(HttpStatus.UNAUTHORIZED, "유효하지 않은 사용자입니다.");
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            boolean isChangePassword = travelerRepository.updateTravelerPasswordByTravelerEmail(emailSmtpDto.getEmail(), encoder.encode(randomCode));
            if (!isChangePassword) {
                throw new CustomException(HttpStatus.UNAUTHORIZED, "유효하지 않은 사용자입니다.");
            }

            context.setVariable("emailTitle", "임시 비밀번호");
            context.setVariable("emailCode", randomCode);
            String htmlContent = templateEngine.process("email-auth", context);

            emailSmtpDto.setMessage(htmlContent);
        } else if(emailSmtpDto.getEmailType().equals(EmailSmtpEnum.FIND_NICKNAME.getType())){
            // 닉네임 찾기 - 닉네임
            Optional<Traveler> getTraveler = travelerRepository.findByEmail(emailSmtpDto.getEmail());
            if (getTraveler.isEmpty()) {
                throw new CustomException(HttpStatus.BAD_REQUEST, "등록되지 않은 이메일 입니다.");
            }

            context.setVariable("emailTitle", emailSmtpDto.getEmail() + "님의 닉네임입니다.");
            context.setVariable("emailCode", getTraveler.get().getNickname());
            String htmlContent = templateEngine.process("email-auth", context);

            emailSmtpDto.setMessage(htmlContent);
        }

        // 이메일 발송 세팅
        EmailSMTP emailMessage = EmailSMTP.builder()
                .recipient(emailSmtpDto.getEmail())
                .subject(emailSmtpDto.getSubject())
                .message(emailSmtpDto.getMessage())
                .code(randomCode)
                .emailType(emailSmtpDto.getEmailType())
                .build();

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
        mimeMessageHelper.setFrom(sendEmail); // 발신자
        mimeMessageHelper.setTo(emailMessage.getRecipient()); // 수신자
        mimeMessageHelper.setSubject(emailMessage.getSubject()); // 메일 제목
        mimeMessageHelper.setText(emailMessage.getMessage(), true); // 메일 본문 내용, HTML 여부

        // 이메일 전송
        javaMailSender.send(mimeMessage);

        // 전송 이력 DB저장
        emailSmtpRepository.save(emailMessage);

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
                throw new CustomException(HttpStatus.GONE, "이메일 인증시간이 만료되었습니다.");
            }
        }

        return getFindCode.map(emailSMTP ->
                emailSMTP.getRecipient().equals(emailSmtpDto.getEmail())).orElse(false);
    }



    /**
     * 회원가입 - 이메일 인증 코드 생성
     */
    private String generateRandomCode() {
        final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        final int CODE_LENGTH = 6;

        StringBuilder code = new StringBuilder();
        SecureRandom random = new SecureRandom();

        for (int i = 0; i < CODE_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(randomIndex));
        }

        return code.toString();
    }
}
