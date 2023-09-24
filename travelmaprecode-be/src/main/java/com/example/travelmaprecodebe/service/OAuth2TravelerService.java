package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.global.Role;
import com.example.travelmaprecodebe.repository.TravelerRepository;
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
public class OAuth2TravelerService {

    private final TravelerRepository travelerRepository;

    @Transactional
    public Traveler oAuthDoLogin(String naverId, String nickname, String email) {
        Optional<Traveler> traveler = travelerRepository.findByEmail(email);
        if (traveler.isPresent()) {
            Traveler getTraveler = traveler.get();
            getTraveler.updateLastLoginIpAddress(CommonUtil.getIpAddress());
            getTraveler.updateLastLoginDate();

            return traveler.get();
        }

        Traveler newTraveler = Traveler.builder()
                .email(email)
                .name(nickname)
                .password(naverId) // TODO: random password, because this won't use evermore
                .role(Role.USER)
                .signupServices("naver")
                .lastLoginIpAddress(getIpAddress())
                .build();

        return travelerRepository.save(newTraveler);
    }
}
