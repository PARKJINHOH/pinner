package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.global.Role;
import com.example.travelmaprecodebe.repository.TravelerRepository;
import com.example.travelmaprecodebe.security.oauth.OAuthLoginAttributes;
import com.example.travelmaprecodebe.utils.CommonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.example.travelmaprecodebe.utils.CommonUtil.getIpAddress;


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

            return traveler.get();
        }

        return register(attr);
    }

    private Traveler register(OAuthLoginAttributes attr) {
        Traveler newTraveler = Traveler.builder()
                .signupServices(attr.serviceName())
                .email(attr.email())
                .name(attr.nickname())
                .password("NEED_TO_BE_RANDOM") // TODO: random password, because this won't use evermore
                .role(Role.USER)
                .lastLoginIpAddress(getIpAddress())
                .build();

        return travelerRepository.save(newTraveler);
    }
}
