package com.example.travelmaprecodebe.domain.image;

import org.springframework.security.core.Authentication;

public interface RestrictedImageProvider<Key> extends ImageProvider<Key> {
    Key save(byte[] image, Authentication authentication);

    byte[] load(Key key, Authentication authentication);
}
