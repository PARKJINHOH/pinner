package com.example.travelmaprecodebe.domain.traveler;

import com.example.travelmaprecodebe.domain.security.jwt.RefreshToken;
import com.example.travelmaprecodebe.domain.security.jwt.JwtUtils;
import com.example.travelmaprecodebe.domain.security.services.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelerService {

    private final TravelerRepository travelerRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

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

//    public TravelerDto doLogin_bk(TravelerDto travelerDto) {
//        Traveler traveler = travelerRepository.findByEmail(travelerDto.getEmail()).orElse(null);
//        if (!passwordEncoder.matches(travelerDto.getPassword(), traveler.getPassword())) {
////            throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
//            return null;
//        }
//        String token = jwtTokenProvider.createToken(String.valueOf(traveler.getEmail()), traveler.getRole());
//
//        TravelerDto responseTraveler = new TravelerDto();
//        responseTraveler.setEmail(traveler.getEmail());
//        responseTraveler.setToken(token);
//
//        return responseTraveler;
//    }

    public TravelerDto doLogin(TravelerDto travelerDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(travelerDto.getEmail(), travelerDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Traveler traveler = (Traveler) authentication.getPrincipal();

        String accessToken = jwtUtils.generateJwtToken(traveler);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(traveler.getEmail());

        TravelerDto responseTraveler = new TravelerDto();
        responseTraveler.setAccessToken(accessToken);
        responseTraveler.setRefreshToken(refreshToken.getToken());
        responseTraveler.setName(traveler.getName());
        responseTraveler.setEmail(traveler.getEmail());

        return responseTraveler;

    }


    public void doLogout(TravelerDto travelerDto) {
        int result = refreshTokenService.deleteByEmail(travelerDto.getEmail());
    }
}
