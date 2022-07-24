package com.example.travelmaprecodebe.domain.traveler.service;

import com.example.travelmaprecodebe.domain.traveler.TravelerDto;
import com.example.travelmaprecodebe.domain.traveler.TravelerEntity;
import com.example.travelmaprecodebe.domain.traveler.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelerService {
    private final TravelerRepository travelerRepository;

    public boolean emailCheck(String email) {
        final Optional<TravelerEntity> byEmail = travelerRepository.findByEmail(email);
        if (byEmail.isPresent()) {
            log.info("Duplicate Email : {}", byEmail.get().getEmail());
            return false;
        } else {
            return true;
        }
    }

    @Transactional
    public String register(TravelerDto travelerDto) {
        if (travelerRepository.findByEmail(travelerDto.getEmail()).orElse(null) == null){
            return travelerRepository.save(travelerDto.toEntity()).getEmail();
        }
        return "fail";
//        todo
//        else {
//            throw new EmailSignupFailedException();
//        }

    }
}
