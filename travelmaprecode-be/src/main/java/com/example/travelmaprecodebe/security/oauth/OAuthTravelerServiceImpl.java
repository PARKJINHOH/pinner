package com.example.travelmaprecodebe.security.oauth;

import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.service.OAuth2TravelerService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final OAuth2TravelerService travelerService;


    public record CustomOAuthUser(Traveler traveler, Map<String, Object> attributes) implements OAuth2User {

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
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        log.info("===== loadUser =====");
        log.info("userRequest.getAdditionalParameters() : {}", userRequest.getAdditionalParameters());
        log.info("userRequest.getClientRegistration() : {}", userRequest.getClientRegistration());
        log.info("oAuth2User : {}", oAuth2User);
        log.info("oAuth2User.getName() : {}", oAuth2User.getName());
        log.info("oAuth2User.getAttributes() : {}", oAuth2User.getAttributes());

        // 사용자가 없으면 저장
        try {
            NaverResponseWrapper wrapper = NaverResponseWrapper.from(oAuth2User.getAttributes());
            if (!wrapper.isSuccess()) {
                throw new OAuthUserInfoException("네이버 로그인 실패: " + wrapper.message);
            }

            String id = wrapper.response.id;
            String nickname = wrapper.response.nickname;

            if (nickname == null) {
                throw new OAuthUserInfoException("response에 nickname이 없습니다. 네이버 로그인 API에서 해당 항목을 필수로 변경해주세요.");
            }

            Traveler traveler = travelerService.oAuthDoLogin(id, nickname);
            return new CustomOAuthUser(traveler, oAuth2User.getAttributes());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    static class OAuthUserInfoException extends Exception {

        public OAuthUserInfoException() {
            super();
        }

        public OAuthUserInfoException(String message) {
            super(message);
        }

        public OAuthUserInfoException(String message, Throwable cause) {
            super(message, cause);
        }

        public OAuthUserInfoException(Throwable cause) {
            super(cause);
        }

        protected OAuthUserInfoException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
            super(message, cause, enableSuppression, writableStackTrace);
        }
    }

    @Data
    static class NaverResponseWrapper {

        String resultcode;
        String message;
        NaverResponse response;

        static NaverResponseWrapper from(Map<String, Object> jsonObject) throws JsonProcessingException {
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
