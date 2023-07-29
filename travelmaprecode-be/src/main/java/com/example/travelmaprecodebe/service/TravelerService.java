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
    public String register(TravelerDto.Request travelerDto) {
        if (travelerRepository.findByEmail(travelerDto.getEmail()).orElse(null) == null) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            travelerDto.setPassword(encoder.encode(travelerDto.getPassword()));
            return travelerRepository.save(travelerDto.toEntity()).getEmail();
        } else {
            return null;
        }
    }

    public TravelerDto.Response doLogin(TravelerDto.Request travelerDto) {

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(travelerDto.getEmail(), travelerDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            Traveler traveler = (Traveler) authentication.getPrincipal();

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(traveler.getEmail());
            String accessToken = jwtUtils.generateJwtToken(traveler);

            return TravelerDto.Response.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .name(traveler.getName())
                    .email(traveler.getEmail())
                    .build();

        } catch (Exception e) {
            log.error("로그인 실패 : {}", e.getMessage());
            return null;
        }
    }

    public void doLogout(TravelerDto.Request travelerDto) {
        Optional<RefreshToken> refreshToken = refreshTokenService.findByToken(travelerDto.getRefreshToken());
        refreshToken.ifPresent(token -> refreshTokenService.deleteByEmail(token.getTraveler().getEmail()));
    }

    public TravelerDto.Response getRefreshToken(TravelerDto.Request travelerDto) {
        String requestRefreshToken = travelerDto.getRefreshToken();

        // Refresh Token
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken).orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
        RefreshToken validRefreshToken = refreshTokenService.verifyExpiration(refreshToken);

        // Access Token
        String validAccessToken = jwtUtils.generateTokenFromUsername(validRefreshToken.getTraveler().getEmail());

        return TravelerDto.Response.builder()
                .refreshToken(validRefreshToken.getToken())
                .accessToken(validAccessToken)
                .build();

    }
}
