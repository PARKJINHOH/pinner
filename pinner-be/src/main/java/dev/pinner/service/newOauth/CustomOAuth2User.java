package dev.pinner.service.newOauth;

import dev.pinner.global.enums.RoleEnum;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
public class CustomOAuth2User extends DefaultOAuth2User {

    private Long id;
    private String email;
    private RoleEnum role;

    public CustomOAuth2User(Collection<? extends GrantedAuthority> authorities,
                            Map<String, Object> attributes, String nameAttributeKey,
                            Long id, String email, RoleEnum role) {
        super(authorities, attributes, nameAttributeKey);
        this.id = id;
        this.email = email;
        this.role = role;
    }
}