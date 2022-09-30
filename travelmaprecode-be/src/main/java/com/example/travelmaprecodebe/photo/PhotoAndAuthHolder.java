package com.example.travelmaprecodebe.photo;

import lombok.Getter;

@Getter
public class PhotoAndAuthHolder implements PhotoHolder {
    private final byte[] data;
    private final String owner;

    public PhotoAndAuthHolder(byte[] data, String owner) {
        this.data = data;
        this.owner = owner;
    }

    @Override
    public byte[] getData() {
        return data;
    }
}
