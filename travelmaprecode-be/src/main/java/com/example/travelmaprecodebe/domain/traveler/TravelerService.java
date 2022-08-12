package com.example.travelmaprecodebe.domain.traveler;

import com.example.travelmaprecodebe.domain.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelerService{

    private final TravelerRepository travelerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public String register(TravelerDto travelerDto) {
        if (travelerRepository.findByEmail(travelerDto.getEmail()).orElse(null) == null) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            travelerDto.setPassword(encoder.encode(travelerDto.getPassword()));
            return travelerRepository.save(travelerDto.toEntity()).getEmail();
        } else {
            return null;
        }
    }

    public TravelerDto doLogin(TravelerDto travelerDto) {
        Traveler traveler = travelerRepository.findByEmail(travelerDto.getEmail()).orElse(null);
        if (!passwordEncoder.matches(travelerDto.getPassword(), traveler.getPassword())) {
//            throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
            return null;
        }
        String token = jwtTokenProvider.createToken(String.valueOf(traveler.getEmail()), traveler.getRole());

        TravelerDto responseTraveler = new TravelerDto();
        responseTraveler.setEmail(traveler.getEmail());
        responseTraveler.setToken(token);

        return responseTraveler;
    }



}
