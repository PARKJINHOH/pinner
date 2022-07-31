package com.example.travelmaprecodebe.domain.image;

public interface ImageProvider<Key> {
    Key save(byte[] image);
    byte[] load(Key key);
}
