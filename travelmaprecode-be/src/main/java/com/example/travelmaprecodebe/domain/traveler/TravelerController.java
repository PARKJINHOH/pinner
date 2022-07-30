package com.example.travelmaprecodebe.domain.traveler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@RequiredArgsConstructor
public class TravelerController {

    private final TravelerService travelerService;

    @GetMapping("/member/echo")
    public String echo(@AuthenticationPrincipal OAuth2User principal) {
        System.out.println("principal = " + principal);
        return "hello " + principal.getAttribute("email");
    }

//    @GetMapping("/identities/email/{email}")
//    public ResponseEntity<Boolean> getDuplicateEmail(@PathVariable String email) {
//        final boolean checkEmail = travelerService.emailCheck(email);
//        System.out.println("중복 검사 " + email);
//
//        if (checkEmail) { // 중복이 아닐 때 (409)
//            return new ResponseEntity<>(true, HttpStatus.OK);
//        } else { // 중복
//            return new ResponseEntity<>(false, HttpStatus.CONFLICT);
//        }
//    }

    @PostMapping("/email")
    public ResponseEntity<String> postEmail(@RequestBody TravelerDto travelerDto) {
        System.out.println("skjerhlksjehr");
        final String resultEmail = travelerService.register(travelerDto);

        if (resultEmail.equals("fail")) {
            return ResponseEntity.badRequest().body("회원가입에 실패했습니다.");
        }

        return new ResponseEntity<>(resultEmail, HttpStatus.CREATED);
    }

}
