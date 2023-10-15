package dev.pinner.service.oauth;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.global.enums.RoleEnum;
import dev.pinner.repository.TravelerRepository;
import dev.pinner.domain.record.OAuthLoginUserRecord;
import dev.pinner.global.utils.CommonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static dev.pinner.global.utils.CommonUtil.getIpAddress;


@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthLoginService {

    private final TravelerRepository travelerRepository;

    @Transactional
    public Traveler registerOrLogin(OAuthLoginUserRecord attr) {
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

    private Traveler register(OAuthLoginUserRecord attr) {
        Traveler newTraveler = Traveler.builder()
                .signupServices(attr.serviceName())
                .email(attr.email())
                .nickname(attr.nickname())
                .oauthAccessToken(attr.accessToken())
                .roleEnum(RoleEnum.USER)
                .lastLoginIpAddress(getIpAddress())
                .build();

        return travelerRepository.save(newTraveler);
    }
}
