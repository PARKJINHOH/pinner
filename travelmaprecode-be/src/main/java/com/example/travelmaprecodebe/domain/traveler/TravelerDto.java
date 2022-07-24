package com.example.travelmaprecodebe.domain.traveler;

import lombok.Data;

@Data
public class TravelerDto {

    private String email;
    private String password;

    public TravelerEntity toEntity() {
        return TravelerEntity.builder()
                .email(email)
                .password(password)
                .state("U")
                .roleCd("USER")
                .build();
    }
}
