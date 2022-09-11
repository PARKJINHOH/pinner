package com.example.travelmaprecodebe.domain.dto;

import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.global.Role;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TravelerDto {

    private String email;
    private String name;
    private String password;

    private String accessToken;
    private String refreshToken;

    public Traveler toEntity() {
        return Traveler.builder()
                .email(email)
                .name(name)
                .password(password)
                .role(Role.USER) // Default User
                .build();
    }
}
