package com.example.travelmaprecodebe.domain.image;

import lombok.Getter;

@Getter
public class KeyAndAuthData {
    private final String key;
    private final String email;

    public KeyAndAuthData(String key, String email) {
        this.key = key;
        this.email = email;
    }
}
