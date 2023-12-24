package dev.pinner.service.oauth;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.global.enums.OauthServiceCodeEnum;
import dev.pinner.global.enums.RoleEnum;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.oauth2.core.OAuth2AccessToken;

import java.util.Map;

/**
 * 각 소셜에서 받아오는 데이터가 다르므로
 * 소셜별로 데이터를 받는 데이터를 분기 처리하는 DTO 클래스
 */
@Getter
public class OAuthAttributes {

    private final String nameAttributeKey;
    private final OAuth2UserInfo oauth2UserInfo; // 소셜 타입별 로그인 유저 정보(닉네임, 이메일 등등)

    @Builder
    private OAuthAttributes(String nameAttributeKey, OAuth2UserInfo oauth2UserInfo) {
        this.nameAttributeKey = nameAttributeKey;
        this.oauth2UserInfo = oauth2UserInfo;
    }

    public static OAuthAttributes of(String socialType, String userNameAttributeName, Map<String, Object> attributes) {

        if (socialType.equals(OauthServiceCodeEnum.NAVER.getSignupServices())) {
            return ofNaver(userNameAttributeName, attributes);
        }
        return ofGoogle(userNameAttributeName, attributes);
    }

    public static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .nameAttributeKey(userNameAttributeName)
                .oauth2UserInfo(new GoogleOAuth2UserInfo(attributes))
                .build();
    }

    public static OAuthAttributes ofNaver(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .nameAttributeKey(userNameAttributeName)
                .oauth2UserInfo(new NaverOAuth2UserInfo(attributes))
                .build();
    }

    public Traveler toEntity(String socialType, OAuth2UserInfo oauth2UserInfo, OAuth2AccessToken oAuth2AccessToken) {
        return Traveler.builder()
                .signupServices(socialType)
                .email(oauth2UserInfo.getEmail())
                .nickname(oauth2UserInfo.getNickname())
                .roleEnum(RoleEnum.USER)
                .oauthAccessToken(oAuth2AccessToken.getTokenValue())
                .build();
    }
}