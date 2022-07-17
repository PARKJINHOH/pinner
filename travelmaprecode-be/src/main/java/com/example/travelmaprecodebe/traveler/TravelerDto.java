package com.example.travelmaprecodebe.traveler;

import lombok.Builder;
import lombok.Data;

@Data
public class TravelerDto {

    private String email;
    private String password;

    @Builder
    public TravelerDto(String email) {
        this.email = email;
    }

    @Builder
    public TravelerDto(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
