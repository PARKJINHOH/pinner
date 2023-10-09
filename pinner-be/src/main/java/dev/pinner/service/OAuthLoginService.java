package dev.pinner.service;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.global.Role;
import dev.pinner.repository.TravelerRepository;
import dev.pinner.security.oauth.OAuthLoginAttributes;
import dev.pinner.utils.CommonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static dev.pinner.utils.CommonUtil.getIpAddress;


@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthLoginService {

    private final TravelerRepository travelerRepository;

    @Transactional
    public Traveler registerOrLogin(OAuthLoginAttributes attr) {
        Optional<Traveler> traveler = travelerRepository.findByEmail(attr.email());
        if (traveler.isPresent()) {
            Traveler getTraveler = traveler.get();

            getTraveler.updateLastLoginIpAddress(CommonUtil.getIpAddress());
            getTraveler.updateLastLoginDate();
            getTraveler.updateOauthAccessToken(attr.accessToken());

            return traveler.get();
        }

        return register(attr);
    }

    private Traveler register(OAuthLoginAttributes attr) {
        Traveler newTraveler = Traveler.builder()
                .signupServices(attr.serviceName())
                .email(attr.email())
                .name(attr.nickname())
                .oauthAccessToken(attr.accessToken())
                .role(Role.USER)
                .lastLoginIpAddress(getIpAddress())
                .build();

        return travelerRepository.save(newTraveler);
    }
}
