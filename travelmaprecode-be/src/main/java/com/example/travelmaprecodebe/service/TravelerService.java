package com.example.travelmaprecodebe.service;

import com.example.travelmaprecodebe.domain.dto.TravelerDto;
import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.exceprion.TokenRefreshException;
import com.example.travelmaprecodebe.repository.TravelerRepository;
import com.example.travelmaprecodebe.security.jwt.JwtUtils;
import com.example.travelmaprecodebe.security.jwt.RefreshToken;
import com.example.travelmaprecodebe.security.jwt.RefreshTokenService;
import com.example.travelmaprecodebe.utils.CommonUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelerService {

    private final TravelerRepository travelerRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @Value("${spring.security.oauth2.client.registration.naver.clientId}")
    String clientId_naver;

    @Value("${spring.security.oauth2.client.registration.naver.clientSecret}")
    String clientSecret_naver;

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

    @Transactional
    public TravelerDto.Response doLogin(TravelerDto.Request travelerDto) {

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(travelerDto.getEmail(), travelerDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            Traveler traveler = (Traveler) authentication.getPrincipal();

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(traveler.getEmail());
            String accessToken = jwtUtils.generateJwtToken(traveler);

            Optional<Traveler> optionalTraveler = travelerRepository.findById(traveler.getId());
            optionalTraveler.ifPresent(getTraveler -> {
                getTraveler.updateLastLoginIpAddress(CommonUtil.getIpAddress());
                getTraveler.updateLastLoginDate();
                getTraveler.initLoginFailureCount();
            });

            return TravelerDto.Response.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .name(traveler.getName())
                    .email(traveler.getEmail())
                    .signupServices(traveler.getSignupServices())
                    .build();

        } catch (Exception e) {
            Optional<Traveler> optionalTraveler = travelerRepository.findByEmail(travelerDto.getEmail());
            optionalTraveler.ifPresent(Traveler::addLoginFailureCount);

            log.error("[{}] 로그인 실패 : {}", travelerDto.getEmail(), e.getMessage());
            return null;
        }
    }

    @Transactional
    public TravelerDto.Response doLoginBySocial(Long travlerId) {
        try {
            Optional<Traveler> maybeTraveler = travelerRepository.findById(travlerId);
            if (maybeTraveler.isEmpty()) {
                return null;
            }

            Traveler traveler = maybeTraveler.get();

            maybeTraveler.ifPresent(getTraveler -> {
                getTraveler.updateLastLoginIpAddress(CommonUtil.getIpAddress());
                getTraveler.updateLastLoginDate();
            });

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(traveler.getEmail());
            String accessToken = jwtUtils.generateJwtToken(traveler);

            return TravelerDto.Response.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .name(traveler.getName())
                    .email(traveler.getEmail())
                    .signupServices(traveler.getSignupServices())
                    .build();

        } catch (Exception e) {
            log.error("로그인 실패 : {}", e.getMessage());
            return null;
        }
    }

    public boolean passwordCheck(TravelerDto.Request travelerDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(travelerDto.getEmail(), travelerDto.getPassword()));
            return authentication.isAuthenticated();
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public TravelerDto.Response updateTraveler(TravelerDto.Request travelerDto) {
        Optional<Traveler> findTraveler = travelerRepository.findByEmail(travelerDto.getEmail());
        String newPassword = travelerDto.getNewPassword();

        if (findTraveler.isPresent()) {
            Traveler traveler = findTraveler.get();
            if (travelerDto.getNewPassword() != null) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                traveler.updatePassword(encoder.encode(travelerDto.getNewPassword()));
                traveler.updateLastChangePasswordDate();
            }
            if (travelerDto.getName() != null) {
                traveler.updateNickname(travelerDto.getName());
            }

            // Token 재생성
            travelerDto.setPassword(Optional.ofNullable(newPassword).orElse(travelerDto.getPassword()));
            return this.doLogin(travelerDto);
        } else {
            return null;
        }

    }

    @Transactional
    public void doLogout(TravelerDto.Request travelerDto) {
        Optional<RefreshToken> refreshToken = refreshTokenService.findByToken(travelerDto.getRefreshToken());
        refreshToken.ifPresent(token -> refreshTokenService.deleteByEmail(token.getTraveler().getEmail()));
    }

    @Transactional
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

    @Transactional
    public boolean deleteTraveler(TravelerDto.Request travelerDto) {
        Optional<Traveler> findTraveler = travelerRepository.findByEmail(travelerDto.getEmail());

        if (findTraveler.isPresent()) {
            Traveler traveler = findTraveler.get();
            boolean updatedResult = travelerRepository.updateTravelerStateByTravelerEmail(traveler.getId());

            if (!updatedResult) {
                throw new RuntimeException("[deleteTraveler] Failed to update traveler state. RollBack transaction.");
            }

            if (traveler.getSignupServices().equals("Naver")) {
                // Token 갱신
                // Access Token은 유효기간이 1시간임.
//                String apiTokenUrl = ("https://nid.naver.com/oauth2.0/token?grant_type=refresh_token" +
//                        "&client_id=%s" +
//                        "&client_secret=%s" +
//                        "&refresh_token=%s").formatted(clientId_naver, clientSecret_naver, traveler.getPassword());
//                JsonObject resultToken = requestToServer(apiTokenUrl);

                String apiUrl =("https://nid.naver.com/oauth2.0/token?grant_type=delete" +
                        "&client_id=%s" +
                        "&client_secret=%s" +
                        "&access_token=%s" +
                        "&service_provider=NAVER").formatted(clientId_naver, clientSecret_naver, traveler.getPassword());

                // 탈퇴 호출
                JsonObject resultDelete = requestToServer(apiUrl);
                // 기존 계정이 있다면 status true 변경 후 기존계정과 연동된다는 alert 뜨기,
                if (resultDelete == null) {
                    return false;
                } else {
                    return resultDelete.get("result").getAsString().equals("success");
                }
            }
        }

        return true;
    }


    private JsonObject requestToServer(String apiURL) {
        try {
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            // 통신
            int responseCode = con.getResponseCode();

            BufferedReader br;
            if (responseCode == HttpStatus.OK.value()) {
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }

            String inputLine;
            StringBuilder response = new StringBuilder();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();

            if (responseCode == HttpStatus.OK.value()) {
                Gson gson = new Gson();
                return gson.fromJson(response.toString(), JsonObject.class);
            } else {
                return null;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }
}
