package com.example.travelmaprecodebe.traveler.register;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RegisterController {

    private final RegisterSerivce registerSerivce;

    @GetMapping("/duplicate/email/{email}")
    public ResponseEntity<Boolean> getDuplicateEmail(@PathVariable String email) {
        final boolean checkEmail = registerSerivce.getCheckEmail(email);

        if (checkEmail) { // 중복이 아닐 때 (409)
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else { // 중복
            return new ResponseEntity<>(false, HttpStatus.CONFLICT);
        }
    }


}
