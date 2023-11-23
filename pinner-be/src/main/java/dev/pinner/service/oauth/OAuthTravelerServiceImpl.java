package dev.pinner.service.oauth;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.domain.record.OAuthLoginUserRecord;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.pinner.exception.CustomException;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthTravelerServiceImpl implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final OAuthLoginService travelerService;


    public record CustomOAuthUser(Traveler traveler, Map<String, Object> attributes)
            implements OAuth2User, ICustomUser {
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

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        NaverResponseWrapper wrapper = NaverResponseWrapper.from(oAuth2User.getAttributes());

        if (!wrapper.isSuccess()) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "네이버 로그인 실패: " + wrapper.message);
        }

        String nickname = wrapper.response.nickname;
        String email = wrapper.response.email;

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

        return new CustomOAuthUser(traveler, oAuth2User.getAttributes());
    }

    @Data
    static class NaverResponseWrapper {

        String resultcode;
        String message;
        NaverResponse response;

        static NaverResponseWrapper from(Map<String, Object> jsonObject) {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.convertValue(jsonObject, NaverResponseWrapper.class);
        }

        boolean isSuccess() {
            return resultcode.equals("00") || message.equals("success");
        }
    }

    @Data
    @NoArgsConstructor
    static class NaverResponse {
        String email;
        String nickname;
        String profileImage;
        String age;
        String gender;
        String id;
        String name;
        String birthday;
        String birthyear;
        String mobile;
    }

}
