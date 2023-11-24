package dev.pinner.domain.record;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.service.oauth.ICustomUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public record CustomOAuthUser(Traveler traveler, Map<String, Object> attributes) implements OAuth2User, ICustomUser {
    @Override
    public Traveler getTraveler() {
        return traveler;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return traveler.getAuthorities();
    }

    @Override
    public String getName() {
        return traveler.getEmail();
    }
}
