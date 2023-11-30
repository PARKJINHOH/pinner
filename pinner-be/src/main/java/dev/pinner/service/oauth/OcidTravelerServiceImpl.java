package dev.pinner.service.oauth;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.domain.record.CustomOidcUserRecord;
import dev.pinner.domain.record.OAuthLoginUserRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

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

        OAuthLoginUserRecord attr = new OAuthLoginUserRecord(
                userRequest.getClientRegistration().getClientName(),
                idToken.getEmail(),
                idToken.getFullName(),
                userRequest.getAccessToken().getTokenValue() // todo : Check
        );

        log.info("OIDC 로그인 시도: {}", attr);


        Traveler traveler = travelerService.registerOrLogin(attr);

        return new CustomOidcUserRecord(traveler, idToken, oidcUser.getUserInfo());
    }
}
