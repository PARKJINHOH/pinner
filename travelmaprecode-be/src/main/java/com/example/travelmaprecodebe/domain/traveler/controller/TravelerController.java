package com.example.travelmaprecodebe.domain.traveler.controller;

import com.example.travelmaprecodebe.domain.traveler.TravelerDto;
import com.example.travelmaprecodebe.domain.traveler.service.TravelerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TravelerController {

    private final TravelerService travelerService;

    @GetMapping("/identities/email/{email}")
    public ResponseEntity<Boolean> getDuplicateEmail(@PathVariable String email) {
        final boolean checkEmail = travelerService.emailCheck(email);

        if (checkEmail) { // 중복이 아닐 때 (409)
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else { // 중복
            return new ResponseEntity<>(false, HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/email")
    public ResponseEntity<String> postEmail(@RequestBody TravelerDto travelerDto) {
        final String resultEmail = travelerService.register(travelerDto);

        if(resultEmail == "fail"){
            return ResponseEntity.badRequest().body("회원가입에 실패했습니다.");
        }

        return new ResponseEntity<>(resultEmail, HttpStatus.CREATED);
    }
    
}
