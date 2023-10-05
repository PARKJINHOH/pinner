package com.example.travelmaprecodebe.utils;

import java.security.SecureRandom;

public class RandomHexStringGenerator {
    public String generate(int numBytes) {
        if (numBytes <= 0) {
            throw new IllegalArgumentException("Number of bytes must be positive");
        }

        SecureRandom random = new SecureRandom();
        byte[] randomBytes = new byte[numBytes];
        random.nextBytes(randomBytes);

        StringBuilder hexString = new StringBuilder(2 * numBytes);
        for (byte b : randomBytes) {
            // Convert each byte to a 2-character hex string
            hexString.append(String.format("%02x", b));
        }

        return hexString.toString();
    }
}
