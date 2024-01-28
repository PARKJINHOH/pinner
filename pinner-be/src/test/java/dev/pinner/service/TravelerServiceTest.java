package dev.pinner.service;

import dev.pinner.domain.dto.TravelerDto;
import dev.pinner.exception.BusinessException;
import dev.pinner.repository.TravelerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import javax.transaction.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TravelerServiceTest {

    @Autowired
    private TravelerService travelerService;

    @Autowired
    private TravelerRepository travelerRepository;

    @MockBean
    private AuthenticationManager authenticationManager;

    @BeforeEach
    public void setUp() {
        TravelerDto.Request travelerDto = TravelerDto.Request.builder()
                .email("test@example.com")
                .password("password")
                .nickname("test계정")
                .signupServices("Web")
                .build();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        travelerDto.setPassword(encoder.encode(travelerDto.getPassword()));

        travelerRepository.save(travelerDto.toEntity());
    }

    @Test
    public void 이미_등록된_이메일_주소_등록_테스트() {
        // given
        TravelerDto.Request travelerDto = TravelerDto.Request.builder()
                .email("test@example.com")
                .password("password")
                .nickname("test계정")
                .signupServices("Web")
                .build();

        // when
        BusinessException exception = assertThrows(BusinessException.class, () -> travelerService.register(travelerDto));

        // then
        assertEquals(exception.getHttpStatus(), HttpStatus.CONFLICT);
        assertEquals(exception.getMessage(), "이미 등록된 이메일 주소입니다. 다른 이메일 주소를 사용해주세요.");
    }

    @Test
    public void 정상_등록_테스트() {
        // given
        TravelerDto.Request travelerDto = TravelerDto.Request.builder()
                .email("newTest@example.com")
                .password("password")
                .nickname("new계정")
                .signupServices("Web")
                .build();

        // when
        String nickname = travelerService.register(travelerDto);

        // then
        assertEquals(nickname, "new계정");
    }

    @Test
    public void 사용자_계정_잠긴_경우_테스트() {
        // given
        TravelerDto.Request travelerDto = TravelerDto.Request.builder()
                .email("test@example.com")
                .password("password")
                .build();
        when(authenticationManager.authenticate(any())).thenThrow(LockedException.class);

        // when
        BusinessException exception = assertThrows(BusinessException.class, () -> travelerService.doLogin(travelerDto));

        // then
        assertEquals(exception.getHttpStatus(), HttpStatus.FORBIDDEN);
        assertEquals(exception.getMessage(), "사용자 계정이 잠겨있습니다.");
    }

    @Test
    public void 비밀번호_잘못된_경우_테스트() {
        // given
        TravelerDto.Request travelerDto = TravelerDto.Request.builder()
                .email("test@example.com")
                .password("wrongPassword")
                .build();
        when(authenticationManager.authenticate(any())).thenThrow(BadCredentialsException.class);

        // when
        BusinessException exception = assertThrows(BusinessException.class, () -> travelerService.doLogin(travelerDto));

        // then
        assertEquals(exception.getHttpStatus(), HttpStatus.FORBIDDEN);
        assertEquals(exception.getMessage(), "비밀번호가 잘못되었습니다.");
    }

    @Test
    public void 이메일_없는_경우_테스트() {
        // given
        TravelerDto.Request travelerDto = TravelerDto.Request.builder()
                .email("wrong@example.com")
                .password("password")
                .build();

        when(authenticationManager.authenticate(any())).thenThrow(InternalAuthenticationServiceException.class);

        // when
        BusinessException exception = assertThrows(BusinessException.class, () -> travelerService.doLogin(travelerDto));

        // then
        assertEquals(exception.getHttpStatus(), HttpStatus.NOT_FOUND);
        assertEquals(exception.getMessage(), "이메일을 다시 한번 확인해주세요.");
    }
}

