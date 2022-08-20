package com.example.travelmaprecodebe.domain.security.services;

import com.example.travelmaprecodebe.domain.exceprion.TokenRefreshException;
import com.example.travelmaprecodebe.domain.security.jwt.RefreshToken;
import com.example.travelmaprecodebe.domain.security.jwt.RefreshTokenRepository;
import com.example.travelmaprecodebe.domain.traveler.TravelerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    @Value("${token.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final TravelerRepository travelerRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(String email) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setTraveler(travelerRepository.findByEmail(email).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }

        return token;
    }

    @Transactional
    public int deleteByEmail(String email) {
        return refreshTokenRepository.deleteByTraveler(travelerRepository.findByEmail(email).get());
    }
}

