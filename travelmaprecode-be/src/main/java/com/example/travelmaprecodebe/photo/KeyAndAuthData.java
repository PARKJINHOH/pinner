package com.example.travelmaprecodebe.photo;

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
