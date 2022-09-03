package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.RefreshToken;
import com.example.travelmaprecodebe.domain.Traveler;
import com.example.travelmaprecodebe.domain.TravelerDto;
import com.example.travelmaprecodebe.exceprion.TokenRefreshException;
import com.example.travelmaprecodebe.repository.TravelerRepository;
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

        try {
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

        } catch (Exception e) {
            log.error("로그인 실패 : {}", e.getMessage());
            return null;
        }
    }


    public void doLogout(TravelerDto travelerDto) {
        int result = refreshTokenService.deleteByEmail(travelerDto.getEmail());
    }

    public TravelerDto getRefreshToken(TravelerDto travelerDto) {
        String requestRefreshToken = travelerDto.getRefreshToken();

        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken).orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
        Traveler traveler = refreshTokenService.verifyExpiration(refreshToken).getTraveler();
        String token = jwtUtils.generateTokenFromUsername(traveler.getEmail());

        travelerDto.setRefreshToken(token);

        return travelerDto;

    }
}
