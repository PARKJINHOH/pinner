package dev.pinner.domain.record;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.service.oauth.ICustomUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.Map;

public record CustomOidcUserRecord(Traveler traveler, OidcIdToken idToken, OidcUserInfo userInfo) implements OidcUser, ICustomUser {

    @Override
    public Traveler getTraveler() {
        return traveler;
    }

    @Override
    public Map<String, Object> getClaims() {
        return idToken.getClaims();
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return userInfo;
    }

    @Override
    public OidcIdToken getIdToken() {
        return idToken;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return idToken.getClaims();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return traveler.getAuthorities();
    }

    @Override
    public String getName() {
        return traveler.getNickname();
    }
}
