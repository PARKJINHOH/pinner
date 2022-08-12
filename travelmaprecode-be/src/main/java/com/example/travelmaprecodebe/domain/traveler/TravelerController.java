package com.example.travelmaprecodebe.domain.traveler;

import com.example.travelmaprecodebe.domain.global.ResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/api/traveler")
@RequiredArgsConstructor
public class TravelerController {

    private final TravelerService travelerService;

    @GetMapping("/echo")
    public String echo(@AuthenticationPrincipal OAuth2User principal) {
        log.info("principal : {}", principal);
        return "hello " + principal.getAttribute("email");
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<ResponseDto> postEmail(@RequestBody TravelerDto travelerDto) {
        String getResult = travelerService.register(travelerDto);
        ResponseDto responseDto = new ResponseDto();

        if (getResult == null) {
            responseDto.setMessage("회원가입에 실패했습니다.");
            return new ResponseEntity<>(responseDto, HttpStatus.CONFLICT);
        } else {
            responseDto.setMessage(getResult + "님 회원가입에 성공했습니다.");
            responseDto.setData(new HashMap<>() {{
                put("email", getResult);
            }});

            return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
        }
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ResponseDto> login(@RequestBody TravelerDto travelerDto) {
        TravelerDto getResult = travelerService.doLogin(travelerDto);
        ResponseDto responseDto = new ResponseDto();

        if (getResult == null) {
            responseDto.setMessage("로그인에 실패했습니다.");
            return new ResponseEntity<>(responseDto, HttpStatus.UNAUTHORIZED);
        } else {
            responseDto.setMessage(getResult + "님 로그인에 성공했습니다.");
            responseDto.setData(new HashMap<>() {{
                put("payload", getResult);
            }});
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }
    }

}
