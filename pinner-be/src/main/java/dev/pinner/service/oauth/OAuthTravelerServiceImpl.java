package dev.pinner.service.oauth;

import dev.pinner.domain.dto.oauth.NaverDto;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.domain.record.CustomOAuthUserRecord;
import dev.pinner.domain.record.OAuthLoginUserRecord;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.pinner.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthTravelerServiceImpl implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final OAuthLoginService travelerService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        NaverDto.NaverResponseWrapper wrapper = from(oAuth2User.getAttributes());

        if (!(wrapper.getResultcode().equals("00") || wrapper.getMessage().equals("success"))) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "네이버 로그인 실패: " + wrapper.getMessage());
        }

        String nickname = wrapper.getResponse().getNickname();
        String email = wrapper.getResponse().getEmail();

        if (nickname == null) {
            throw new CustomException(HttpStatus.NOT_FOUND, "네이버 로그인 API에서 닉네임 항목을 필수로 변경해주세요.");
        }

        OAuthLoginUserRecord attr = new OAuthLoginUserRecord(
                userRequest.getClientRegistration().getClientName(),
                email,
                nickname,
                userRequest.getAccessToken().getTokenValue()
        );

        log.info("OAuth 로그인 시도: {}", attr);

        Traveler traveler = travelerService.registerOrLogin(attr);

        return new CustomOAuthUserRecord(traveler, oAuth2User.getAttributes());
    }

    private NaverDto.NaverResponseWrapper from(Map<String, Object> jsonObject) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(jsonObject, NaverDto.NaverResponseWrapper.class);
    }

}
