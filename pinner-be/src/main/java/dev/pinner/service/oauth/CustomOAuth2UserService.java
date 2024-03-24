package dev.pinner.service.oauth;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.exception.BusinessException;
import dev.pinner.global.enums.OauthServiceCodeEnum;
import dev.pinner.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final TravelerRepository travelerRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        log.info("CustomOAuth2UserService.loadUser() 실행 - OAuth2 로그인 요청 진입");

        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2AccessToken accessToken = userRequest.getAccessToken();
        String socialType = getSocialType(registrationId);

        /**
         * [UserNameAttributeName]
         * 가지고올 값의 필드명
         * naver : appapplication.yml > user_name_attribute: response
         * google : sub
         */
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName(); // OAuth2 로그인 시 키(PK)가 되는 값
        Map<String, Object> attributes = oAuth2User.getAttributes(); // 소셜 로그인에서 API가 제공하는 userInfo의 Json 값(유저 정보들) -> 해당정보를 소셜Type마다 파싱시켜주어야함.

        // socialType에 따라 유저 정보를 통해 OAuthAttributes 객체 생성
        OAuthAttributes extractAttributes = OAuthAttributes.of(socialType, userNameAttributeName, attributes);

        Traveler createdUser = getUser(extractAttributes, socialType, accessToken);

        // DefaultOAuth2User를 구현한 CustomOAuth2User 객체를 생성해서 반환
        return new CustomOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(createdUser.getRoleEnum().getKey())),
                attributes,
                extractAttributes.getNameAttributeKey(),
                createdUser.getId(),
                createdUser.getEmail(),
                createdUser.getRoleEnum()
        );
    }

    private String getSocialType(String registrationId) {
        if (OauthServiceCodeEnum.NAVER.getSignupServices().equals(registrationId)) {
            return OauthServiceCodeEnum.NAVER.getSignupServices();
        }
        if (OauthServiceCodeEnum.GOOGLE.getSignupServices().equals(registrationId)) {
            return OauthServiceCodeEnum.GOOGLE.getSignupServices();
        }
        throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "[" + registrationId + "] 허용되지 않은 OauthService입니다.");
    }

    private Traveler getUser(OAuthAttributes attributes, String socialType, OAuth2AccessToken oAuth2AccessToken) {
        String email = attributes.getOauth2UserInfo().getEmail();
        Traveler findUser = travelerRepository.findByEmail(email).orElse(null);

        if (findUser == null) {
            log.info("[{}]{} 소셜회원을 가입합니다.", socialType, email);
            return saveUser(attributes, socialType, oAuth2AccessToken);
        }

        log.info("[{}]{} 소셜회원 로그인.", socialType, email);
        return findUser;
    }

    private Traveler saveUser(OAuthAttributes attributes, String socialType, OAuth2AccessToken oAuth2AccessToken) {
        Traveler createdUser = attributes.toEntity(socialType, attributes.getOauth2UserInfo(), oAuth2AccessToken);
        return travelerRepository.save(createdUser);
    }
}
