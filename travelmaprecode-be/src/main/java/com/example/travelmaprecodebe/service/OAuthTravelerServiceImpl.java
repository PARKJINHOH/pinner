package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.global.Role;
import com.example.travelmaprecodebe.domain.GitHubUser;
import com.example.travelmaprecodebe.domain.Traveler;
import com.example.travelmaprecodebe.repository.TravelerRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthTravelerServiceImpl implements OAuth2UserService {
    private final TravelerRepository travelerRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        log.info("===== loadUser =====");
        log.info("userRequest.getAdditionalParameters() : {}", userRequest.getAdditionalParameters());
        log.info("userRequest.getClientRegistration() : {}", userRequest.getClientRegistration());
        log.info("oAuth2User : {}", oAuth2User);
        log.info("oAuth2User.getName() : {}", oAuth2User.getName());
        log.info("oAuth2User.getAttributes() : {}", oAuth2User.getAttributes());

        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 이메일은 필수이다.
        String email = (String) attributes.get("email");
        if (email == null) {
            try {
                switch(userRequest.getClientRegistration().getClientName()) {
                    case "GitHub":
                        email = fetchEmailFromGitHub(userRequest.getAccessToken().getTokenValue());
                }
            } catch (Exception e) {
                log.error("failed to fetch detail:" + e);
                return null;
            }
        }

        Traveler traveler = saveOrUpdate(email);

        return GitHubUser.fromTraveler(traveler);
    }

    @Data
    static public class GitHubEmailResponse {
        private String email;
        private boolean verified;
        private boolean primary;
        private String visibility;
    }


    private String fetchEmailFromGitHub(String accessToken) throws Exception {
        HttpClient client = HttpClient
                .newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.github.com/user/emails"))
                .setHeader(HttpHeaders.ACCEPT, "application/vnd.github+json")
                .setHeader(HttpHeaders.AUTHORIZATION, String.format("token " + accessToken))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        List<GitHubEmailResponse> myObjects = mapper.readValue(response.body(), new TypeReference<>() {
        });

        return myObjects.get(0).email;
    }

    @Transactional
    public Traveler saveOrUpdate(String email) {
        Traveler traveler = travelerRepository.findMemberByEmail(email);
        if(traveler != null) {
            // TODO: 정보 업데이트
        } else {
            traveler = travelerRepository.save(new Traveler(traveler.getEmail(), traveler.getPassword(), traveler.getEmail(), Role.USER));
        }

        return traveler;
    }
}
