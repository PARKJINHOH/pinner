package com.example.travelmaprecodebe.domain.traveler;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {

    @GetMapping("/hello")
    public String asdf() {
        return "hello";
    }

    @PostMapping("/hello2")
    public String asdf2() {
        return "hello2";
    }
}
