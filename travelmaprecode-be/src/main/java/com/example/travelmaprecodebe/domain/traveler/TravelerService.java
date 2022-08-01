package com.example.travelmaprecodebe.domain.traveler;

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
        final Optional<Traveler> byEmail = travelerRepository.findByEmail(email);
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
        }else{
            return "fail";
        }


    }
}
