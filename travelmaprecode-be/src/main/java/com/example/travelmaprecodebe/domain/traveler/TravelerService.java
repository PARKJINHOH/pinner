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

    public TravelerDto doLogin(TravelerDto travelerDto) {
        TravelerDto responseTraveler = null;
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(travelerDto.getEmail(), travelerDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            Traveler traveler = (Traveler) authentication.getPrincipal();

            String accessToken = jwtUtils.generateJwtToken(traveler);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(traveler.getEmail());

            responseTraveler = new TravelerDto();
            responseTraveler.setAccessToken(accessToken);
            responseTraveler.setRefreshToken(refreshToken.getToken());
            responseTraveler.setName(traveler.getName());
            responseTraveler.setEmail(traveler.getEmail());

        } catch (Exception e) {
            log.error("로그인 실패 : {}", e.getMessage());
        }

        return responseTraveler;

    }


    public void doLogout(TravelerDto travelerDto) {
        int result = refreshTokenService.deleteByEmail(travelerDto.getEmail());
    }
}
