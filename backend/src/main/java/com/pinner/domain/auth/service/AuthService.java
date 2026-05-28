package com.pinner.domain.auth.service;

import com.pinner.domain.auth.dto.*;
import com.pinner.domain.user.entity.User;
import com.pinner.domain.user.repository.UserRepository;
import com.pinner.domain.user.service.UserDetailsImpl;
import com.pinner.global.config.DemoProperties;
import com.pinner.global.exception.BusinessException;
import com.pinner.global.exception.ErrorCode;
import com.pinner.global.jwt.JwtProvider;
import com.pinner.global.redis.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final DemoProperties demoProperties;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }
        User user = User.of(request.email(), passwordEncoder.encode(request.password()), request.nickname());
        userRepository.save(user);
        return new RegisterResponse(user.getId(), user.getEmail(), user.getNickname());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getPassword() == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        return issueTokens(user, false);
    }

    @Transactional
    public AuthResponse demoLogin() {
        User demoUser = userRepository.findByEmail(demoProperties.getEmail())
                .orElseGet(() -> {
                    User newDemo = User.ofDemo(
                            demoProperties.getEmail(),
                            passwordEncoder.encode(demoProperties.getPassword()),
                            demoProperties.getNickname()
                    );
                    return userRepository.save(newDemo);
                });
        return issueTokens(demoUser, true);
    }

    public TokenResponse refresh(RefreshRequest request) {
        RefreshTokenRepository.RefreshPayload payload = refreshTokenRepository.find(request.refreshToken())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));

        User user = userRepository.findById(payload.userId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        refreshTokenRepository.delete(request.refreshToken());

        String newRefreshToken = jwtProvider.generateRefreshToken();
        refreshTokenRepository.save(user.getId(), newRefreshToken, Duration.ofMillis(jwtProvider.getRefreshExpiration()), payload.isDemo());

        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), payload.isDemo());
        return new TokenResponse(accessToken);
    }

    public void logout(LogoutRequest request) {
        refreshTokenRepository.delete(request.refreshToken());
    }

    @Transactional(readOnly = true)
    public UserInfoResponse getMyInfo(UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return new UserInfoResponse(user.getId(), user.getEmail(), user.getNickname(), user.getProvider());
    }

    private AuthResponse issueTokens(User user, boolean isDemo) {
        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail(), isDemo);
        String refreshToken = jwtProvider.generateRefreshToken();
        refreshTokenRepository.save(user.getId(), refreshToken, Duration.ofMillis(jwtProvider.getRefreshExpiration()), isDemo);
        return new AuthResponse(accessToken, refreshToken, user.getId(), user.getEmail(), user.getNickname(), isDemo);
    }
}
