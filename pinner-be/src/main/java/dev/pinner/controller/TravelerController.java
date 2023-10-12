package dev.pinner.controller;

import dev.pinner.domain.dto.ResponseDto;
import dev.pinner.domain.dto.TravelerDto;
import dev.pinner.service.oauth.OAuthAfterLoginService;
import dev.pinner.service.TravelerService;
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
    private final OAuthAfterLoginService afterLoginService;

    @GetMapping("/echo")
    public String echo(@AuthenticationPrincipal OAuth2User principal) {
        log.info("principal : {}", principal);
        return "hello " + principal.getAttribute("email");
    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<ResponseDto> createAccount(@RequestBody TravelerDto.Request travelerDto) {
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
        ResponseDto responseDto = new ResponseDto();
        TravelerDto.Response getResult = travelerService.doLogin(travelerDto);

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


    // Oauth 로그인
    @PostMapping("/afteroauth/{jwtTicket}")
    public ResponseEntity<ResponseDto> afteroauth(@PathVariable String jwtTicket) {
        ResponseDto responseDto = new ResponseDto();

        Long travelerId = afterLoginService.get(jwtTicket);
        if (travelerId == null) {
            responseDto.setMessage("Failed to longin via OAuth: afteroauth entry(%s) are does not exists or expired".formatted(jwtTicket));
            return new ResponseEntity<>(responseDto, HttpStatus.NOT_FOUND);
        }

        TravelerDto.Response getResult = travelerService.doLoginBySocial(travelerId);
        if (getResult == null) {
            responseDto.setMessage("Failed to login via OAuth: no user found who has id(%d)".formatted(travelerId));
            return new ResponseEntity<>(responseDto, HttpStatus.NOT_FOUND);
        }

        responseDto.setMessage(getResult + "님 로그인에 성공했습니다.");
        responseDto.setData(new HashMap<>() {{
            put("payload", getResult);
        }});

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 비밀번호 체크
    @PostMapping("/password/check")
    public ResponseEntity<ResponseDto> passwordCheck(@RequestBody TravelerDto.Request travelerDto) {
        boolean isPasswordValid = travelerService.passwordCheck(travelerDto);
        ResponseDto responseDto = new ResponseDto();

        if (isPasswordValid) {
            responseDto.setMessage("비밀번호가 일치합니다.");
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } else {
            responseDto.setMessage("비밀번호가 일치하지 않습니다.");
            return new ResponseEntity<>(responseDto, HttpStatus.UNAUTHORIZED);
        }
    }

    // 내정보 수정
    @PutMapping()
    public ResponseEntity<ResponseDto> putTraveler(@RequestBody TravelerDto.Request travelerDto) {
        TravelerDto.Response response = travelerService.updateTraveler(travelerDto);
        ResponseDto responseDto = new ResponseDto();

        if (response != null) {
            responseDto.setMessage("수정되었습니다.");
            responseDto.setData(new HashMap<>() {{
                put("payload", response);
            }});
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } else {
            responseDto.setMessage("수정되지 않았습니다.");
            return new ResponseEntity<>(responseDto, HttpStatus.UNAUTHORIZED);
        }
    }

    // github Login
    @PostMapping("/github")
    public ResponseEntity<ResponseDto> githubLogin(@RequestBody TravelerDto.Request travelerDto) {
        ResponseDto responseDto = new ResponseDto();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // token 갱신
    @PostMapping("/renewal/token")
    public ResponseEntity<ResponseDto> refreshToken(@RequestBody TravelerDto.Request travelerDto) {
        TravelerDto.Response getResult = travelerService.getRefreshToken(travelerDto);
        ResponseDto responseDto = new ResponseDto();
        responseDto.setData(new HashMap<>() {{
            put("payload", getResult);
        }});
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<ResponseDto> logoutTraveler(@RequestBody TravelerDto.Request travelerDto) {
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

    // 일반회원 탈퇴
    @PostMapping("/delete")
    public ResponseEntity<ResponseDto> deleteTraveler(@RequestBody TravelerDto.Request travelerDto) {
        ResponseDto responseDto = new ResponseDto();
        boolean isSuccess = travelerService.deleteTraveler(travelerDto);
        if (isSuccess) {
            responseDto.setMessage("탈퇴가 완료되었습니다. \n이용해주셔서 감사합니다.");
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } else {
            responseDto.setMessage("탈퇴 진행이 실패했습니다. \n관리자에게 문의주세요.");
            return new ResponseEntity<>(responseDto, HttpStatus.NOT_FOUND);
        }
    }

    // 소셜로그인 탈퇴
    @PostMapping("/delete/afteroauth")
    public ResponseEntity<ResponseDto> deleteOauthTraveler(@RequestBody TravelerDto.Request travelerDto) {
        ResponseDto responseDto = new ResponseDto();
        boolean isSuccess = travelerService.deleteTraveler(travelerDto);
        if (isSuccess) {
            responseDto.setMessage("탈퇴가 완료되었습니다. \n이용해주셔서 감사합니다.");
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } else {
            responseDto.setMessage("탈퇴 진행이 실패했습니다. \n관리자에게 문의주세요.");
            return new ResponseEntity<>(responseDto, HttpStatus.NOT_FOUND);
        }
    }

}
