package com.example.travelmaprecodebe.security.oauth;

import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.service.OAuthLoginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OcidTravelerServiceImpl implements OAuth2UserService<OidcUserRequest, OidcUser> {
    final OidcUserService delegate = new OidcUserService();
    private final OAuthLoginService travelerService;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        final OidcUser oidcUser = delegate.loadUser(userRequest);
        final OidcIdToken idToken = oidcUser.getIdToken();

        OAuthLoginAttributes attr = new OAuthLoginAttributes(
                userRequest.getClientRegistration().getClientName(),
                idToken.getEmail(),
                idToken.getFullName(),
                userRequest.getAccessToken().getTokenValue() // todo : Check
        );

        log.info("OIDC 로그인 시도: {}", attr);


        Traveler traveler = travelerService.registerOrLogin(attr);

        return new CustomOidcUser(traveler, idToken, oidcUser.getUserInfo());
    }


    public record CustomOidcUser(Traveler traveler, OidcIdToken idToken, OidcUserInfo userInfo)
            implements OidcUser, ICustomUser {

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
            return traveler.getName();
        }
    }

}
