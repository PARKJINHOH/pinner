package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.global.Role;
import com.example.travelmaprecodebe.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2TravelerService {

    private final TravelerRepository travelerRepository;

    @Transactional
    public Traveler oAuthDoLogin(String naverId, String nickname) {
        var traveler = travelerRepository.findByEmail(naverId);
        if (traveler.isPresent()) {
            return traveler.get();
        }

        var newTraveler = Traveler.builder()
                .email(naverId)
                .name(nickname)
                .password(naverId) // TODO: random password, because this won't use evermore
                .role(Role.USER)
                .build();

        return travelerRepository.save(newTraveler);
    }
}
