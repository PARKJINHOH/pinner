package com.example.travelmaprecodebe.photo;

public class SimplePhotoHolder implements PhotoHolder {
    private final byte[] data;

    public SimplePhotoHolder(byte[] data) {
        this.data = data;
    }

    @Override
    public byte[] getData() {
        return data;
    }
}
