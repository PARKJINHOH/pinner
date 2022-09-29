package com.example.travelmaprecodebe.image;

public class SimpleImageHolder implements ImageHolder {
    private final byte[] data;

    public SimpleImageHolder(byte[] data) {
        this.data = data;
    }

    @Override
    public byte[] getData() {
        return data;
    }
}
