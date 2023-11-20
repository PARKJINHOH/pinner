package dev.pinner.controller;

import dev.pinner.domain.dto.EmailSMTPDto;
import dev.pinner.exception.CustomException;
import dev.pinner.global.enums.EmailSmtpEnum;
import dev.pinner.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    /**
     * 이메일 인증
     */
    @PostMapping()
    public ResponseEntity<?> sendJoinMail(@RequestBody @Valid EmailSMTPDto.Request request) throws Exception {
        request.setSubject("[Pinner] 이메일 인증을 위한 인증 코드");
        request.setEmailType(EmailSmtpEnum.EMAIL_CERTIFIED.getType());

        boolean isEmailSend = emailService.sendMail(request);

        if (!isEmailSend) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "이메일 인증을 다시 해주세요.");
        }

        return ResponseEntity.ok().body("이메일을 확인해주세요.");
    }

    /**
     * 이메일 인증 확인
     * @param request
     * @return
     */
    @PostMapping("/check")
    public ResponseEntity<?> emailCheck(@RequestBody EmailSMTPDto.Request request) {
        boolean isAuthentication = emailService.emailCheck(request);

        if (!isAuthentication) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "이메일 인증에 실패했습니다. 이메일 인증코드를 다시 확인해주세요.");
        }

        return ResponseEntity.ok().body("이메일 인증에 성공했습니다.");
    }


    /**
     * 임시비밀번호
     */
    @PostMapping("/reset/password")
    public ResponseEntity<?> resetPassword(@RequestBody EmailSMTPDto.Request request) throws Exception {
        request.setSubject("[Pinner] 임시 비밀번호");
        request.setEmailType(EmailSmtpEnum.TEMPORARY_PASSWORD.getType());

        boolean isEmailSend = emailService.sendMail(request);

        if (!isEmailSend) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "이메일 인증을 다시 해주세요.");
        }

        return ResponseEntity.ok().body("이메일 인증이 완료되었습니다.");
    }

    /**
     * 닉네임 찾기
     */
    @PostMapping("/find/nickname")
    public ResponseEntity<?> findNickname(@RequestBody EmailSMTPDto.Request request) throws Exception {
        request.setSubject("[Pinner] 찾으시는 닉네임");
        request.setEmailType(EmailSmtpEnum.FIND_NICKNAME.getType());

        boolean isEmailSend = emailService.sendMail(request);

        if (!isEmailSend) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "닉네임을 다시 찾아주세요.");
        }

        return ResponseEntity.ok().body("이메일을 확인해주세요.");
    }

}
