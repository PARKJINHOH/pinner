package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.security.jwt.RefreshToken;
import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.domain.dto.TravelerDto;
import com.example.travelmaprecodebe.exceprion.TokenRefreshException;
import com.example.travelmaprecodebe.repository.TravelerRepository;
import com.example.travelmaprecodebe.security.jwt.JwtUtils;
import com.example.travelmaprecodebe.security.jwt.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

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

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(traveler.getEmail());
            String accessToken = jwtUtils.generateJwtToken(traveler);

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
        Optional<RefreshToken> refreshToken = refreshTokenService.findByToken(travelerDto.getRefreshToken());
        refreshToken.ifPresent(token -> refreshTokenService.deleteByEmail(token.getTraveler().getEmail()));
    }

    public TravelerDto getRefreshToken(TravelerDto travelerDto) {
        String requestRefreshToken = travelerDto.getRefreshToken();

        // Refresh Token
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken).orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
        RefreshToken validRefreshToken = refreshTokenService.verifyExpiration(refreshToken);

        // Access Token
        String validAccessToken = jwtUtils.generateTokenFromUsername(validRefreshToken.getTraveler().getEmail());

        travelerDto.setRefreshToken(validRefreshToken.getToken());
        travelerDto.setAccessToken(validAccessToken);

        return travelerDto;

    }
}
