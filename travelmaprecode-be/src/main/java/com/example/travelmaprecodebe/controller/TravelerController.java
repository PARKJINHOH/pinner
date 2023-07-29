package com.example.travelmaprecodebe.controller;

import com.example.travelmaprecodebe.domain.dto.TravelerDto;
import com.example.travelmaprecodebe.service.TravelerService;
import com.example.travelmaprecodebe.domain.dto.ResponseDto;
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
@RequestMapping("/api/v1/traveler")
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
    public ResponseEntity<ResponseDto> postEmail(@RequestBody TravelerDto.Request travelerDto) {
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
    public ResponseEntity<ResponseDto> login(@RequestBody TravelerDto.Request travelerDto) {
        TravelerDto.Response getResult = travelerService.doLogin(travelerDto);
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

    // github Login
    @PostMapping("/github")
    public ResponseEntity<ResponseDto> githubLogin(@RequestBody TravelerDto.Request travelerDto) {
        ResponseDto responseDto = new ResponseDto();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping("/renewal/token")
    public ResponseEntity<ResponseDto> refreshToken(@RequestBody TravelerDto.Request travelerDto) {
        TravelerDto.Response getResult = travelerService.getRefreshToken(travelerDto);
        ResponseDto responseDto = new ResponseDto();
        responseDto.setData(new HashMap<>() {{
            put("payload", getResult);
        }});
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseDto> logoutUser(@RequestBody TravelerDto.Request travelerDto) {
        ResponseDto responseDto = new ResponseDto();
        try {
            travelerService.doLogout(travelerDto);
            responseDto.setMessage("로그아웃 되었습니다.");
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } catch (Exception e) {
            responseDto.setMessage("관리자에게 문의주세요.");
            return new ResponseEntity<>(responseDto, HttpStatus.NOT_FOUND);
        }

    }

}
