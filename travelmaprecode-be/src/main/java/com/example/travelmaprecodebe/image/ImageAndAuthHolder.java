package com.example.travelmaprecodebe.image;

import lombok.Getter;

@Getter
public class ImageAndAuthHolder implements ImageHolder {
    private final byte[] data;
    private final String owner;

    public ImageAndAuthHolder(byte[] data, String owner) {
        this.data = data;
        this.owner = owner;
    }

    @Override
    public byte[] getData() {
        return data;
    }
}
