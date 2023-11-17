package dev.pinner.controller;

import dev.pinner.domain.dto.TravelerDto;
import dev.pinner.service.TravelerService;
import dev.pinner.service.oauth.OAuthAfterLoginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> createAccount(@RequestBody TravelerDto.Request travelerDto) {
        String nickname = travelerService.register(travelerDto);
        return ResponseEntity.ok().body(nickname + "님 회원가입에 성공했습니다.");
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody TravelerDto.Request travelerDto) {
        try {
            TravelerDto.Response response = travelerService.doLogin(travelerDto);

            if (response == null) {
                return ResponseEntity.notFound().build();
            }

            if (response.getEmail().equals(travelerDto.getEmail())) {
                return ResponseEntity.ok().body(response);
            }

            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("로그인에 실패했습니다.");
        }
    }


    // Oauth 로그인
    @PostMapping("/afteroauth/{jwtTicket}")
    public ResponseEntity<?> afterOauth(@PathVariable String jwtTicket) {
        try {
            Long travelerId = afterLoginService.get(jwtTicket);
            if (travelerId == null) {
                return ResponseEntity.internalServerError().body("Failed to longin via OAuth: afteroauth entry(%s) are does not exists or expired".formatted(jwtTicket));
            }

            TravelerDto.Response getResult = travelerService.doLoginBySocial(travelerId);
            if (getResult == null) {
                return ResponseEntity.internalServerError().body("Failed to login via OAuth: no user found who has id(%d)".formatted(travelerId));
            }

            return ResponseEntity.ok().body(getResult);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("Oauth 로그인에 실패했습니다.");
        }
    }

    // 내정보 수정) 비밀번호 체크
    @PostMapping("/password/check")
    public ResponseEntity<?> passwordCheck(@RequestBody TravelerDto.Request travelerDto) {
        try {
            boolean isPasswordValid = travelerService.passwordCheck(travelerDto);

            if (isPasswordValid) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.internalServerError().body("비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("비밀번호가 일치하지 않습니다.");
        }

    }

    // 내정보 수정
    @PutMapping()
    public ResponseEntity<?> putTraveler(@RequestBody TravelerDto.Request travelerDto) {
        try {
            TravelerDto.Response response = travelerService.updateTraveler(travelerDto);

            if (response != null) {
                return ResponseEntity.ok().body(response);
            } else {
                return ResponseEntity.internalServerError().body("수정에 실패했습니다.");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.internalServerError().body("수정에 실패했습니다.");
        }

    }

    // token 갱신
    @PostMapping("/renewal/token")
    public ResponseEntity<?> refreshToken(@RequestBody TravelerDto.Request travelerDto) {
        try {
            TravelerDto.Response response = travelerService.getRefreshToken(travelerDto);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Token 갱신에 실패했습니다.");
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logoutTraveler(@RequestBody TravelerDto.Request travelerDto) {
        try {
            travelerService.doLogout(travelerDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 일반회원 탈퇴
    @PostMapping("/delete")
    public ResponseEntity<?> deleteTraveler(@RequestBody TravelerDto.Request travelerDto) {
        try {
            boolean isSuccess = travelerService.deleteTraveler(travelerDto);
            if(isSuccess){
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.internalServerError().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 소셜로그인 탈퇴
    @PostMapping("/delete/afteroauth")
    public ResponseEntity<?> deleteOauthTraveler(@RequestBody TravelerDto.Request travelerDto) {
        try {
            boolean isSuccess = travelerService.deleteTraveler(travelerDto);
            if(isSuccess){
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.internalServerError().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
