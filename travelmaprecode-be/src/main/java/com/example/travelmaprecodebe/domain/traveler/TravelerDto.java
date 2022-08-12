package com.example.travelmaprecodebe.domain.traveler;

import com.example.travelmaprecodebe.domain.global.Role;
import lombok.Data;

@Data
public class TravelerDto {

    private String email;
    private String password;

    private String token;

    public Traveler toEntity() {
        return Traveler.builder()
                .email(email)
                .name(email)
                .password(password)
                .role(Role.USER) // Default User
                .build();
    }
}
