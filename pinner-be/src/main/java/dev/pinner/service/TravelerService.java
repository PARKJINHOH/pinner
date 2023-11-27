package dev.pinner.service;

import dev.pinner.domain.dto.TravelerDto;
import dev.pinner.domain.dto.oauth.NaverDto;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.exception.CustomException;
import dev.pinner.global.enums.OauthServiceCodeEnum;
import dev.pinner.repository.TravelerRepository;
import dev.pinner.service.jwt.JwtUtils;
import dev.pinner.domain.entity.RefreshToken;
import dev.pinner.service.jwt.RefreshTokenService;
import dev.pinner.global.utils.CommonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;
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
        if (travelerRepository.findByEmail(travelerDto.getEmail()).isPresent()) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 등록된 이메일 주소입니다. 다른 이메일 주소를 사용해주세요.");
        } else {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            travelerDto.setPassword(encoder.encode(travelerDto.getPassword()));
            return travelerRepository.save(travelerDto.toEntity()).getNickname();
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
                    .nickname(traveler.getNickname())
                    .email(traveler.getEmail())
                    .signupServices(traveler.getSignupServices())
                    .build();
        } catch (LockedException ex) {
            throw new CustomException(HttpStatus.FORBIDDEN, "사용자 계정이 잠겨있습니다.");
        } catch (BadCredentialsException ex) {
            Optional<Traveler> optionalTraveler = travelerRepository.findByEmail(travelerDto.getEmail());
            optionalTraveler.ifPresent(Traveler::addLoginFailureCount);
            throw new CustomException(HttpStatus.FORBIDDEN, "비밀번호가 잘못되었습니다.");
        } catch (InternalAuthenticationServiceException ex) {
            throw new CustomException(HttpStatus.NOT_FOUND, "이메일을 다시 한번 확인해주세요.");
        } catch (Exception ex) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "로그인에 실패했습니다. 관리자에게 문의해주세요.");
        }
    }

    @Transactional
    public TravelerDto.Response doLoginBySocial(Long travlerId) {
        Optional<Traveler> maybeTraveler = travelerRepository.findById(travlerId);
        if (maybeTraveler.isEmpty()) {
            throw new CustomException(HttpStatus.NOT_FOUND, "Oauth 사용자를 찾을 수 없습니다. 관리자에게 문의해주세요");
        }
        if (!maybeTraveler.get().getState()) {
            throw new CustomException(HttpStatus.NOT_FOUND, "이미 탈퇴이력이 있는 회원입니다. 가입한 사이트의 연결된 서비스 관리에서 직접 권한을 삭제해주세요.");
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
                .nickname(traveler.getNickname())
                .email(traveler.getEmail())
                .signupServices(traveler.getSignupServices())
                .build();
    }

    public void passwordCheck(TravelerDto.Request travelerDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(travelerDto.getEmail(), travelerDto.getPassword()));
        if(!authentication.isAuthenticated()){
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호가 일치하지 않습니다.");
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
            if (travelerDto.getNickname() != null) {
                traveler.updateNickname(travelerDto.getNickname());
            }

            // Token 재생성
            travelerDto.setPassword(Optional.ofNullable(newPassword).orElse(travelerDto.getPassword()));
            return this.doLogin(travelerDto);
        } else {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "수정에 실패했습니다.");
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
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken).orElseThrow(() -> {
            log.error("[{}] Token이 DB에 없습니다.", requestRefreshToken);
            return new CustomException(HttpStatus.UNAUTHORIZED, "비정상적인 접근입니다.");
        });
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
            if (!findTraveler.get().getEmail().equals(travelerDto.getEmail())) {
                throw new CustomException(HttpStatus.UNAUTHORIZED, "비정상적인 접근입니다.");
            }

            Traveler traveler = findTraveler.get();
            boolean updatedResult = travelerRepository.updateTravelerStateByTravelerEmail(traveler.getId());

            if (!updatedResult) {
                throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "가입된 이력이 없습니다.");
            }

            if (traveler.getSignupServices().equals(OauthServiceCodeEnum.NAVER.getSignupServices())) {
                String apiUrl =("https://nid.naver.com/oauth2.0/token?grant_type=delete" +
                        "&client_id=%s" +
                        "&client_secret=%s" +
                        "&access_token=%s" +
                        "&service_provider=NAVER").formatted(clientId_naver, clientSecret_naver, traveler.getOauthAccessToken());
                return requestToServer(apiUrl, OauthServiceCodeEnum.NAVER.getSignupServices());
            }

            if (traveler.getSignupServices().equals(OauthServiceCodeEnum.GOOGLE.getSignupServices())) {
                String apiUrl =("https://oauth2.googleapis.com/revoke?token=%s").formatted(traveler.getOauthAccessToken());
                return requestToServer(apiUrl, OauthServiceCodeEnum.GOOGLE.getSignupServices());
            }
        }

        return true;
    }


    private Boolean requestToServer(String apiURL, String signupServices) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        if (signupServices.equals(OauthServiceCodeEnum.NAVER.getSignupServices())) {
            ResponseEntity<NaverDto.NaverWithdrawalResponse> resultNaver = restTemplate.exchange(apiURL, HttpMethod.POST, requestEntity, NaverDto.NaverWithdrawalResponse.class);
            log.info("{}({}) : ApiResponse : ({}){}", signupServices, apiURL, resultNaver.getStatusCode(), resultNaver.getBody());
            if (resultNaver.getStatusCode() == HttpStatus.OK && Objects.requireNonNull(resultNaver.getBody()).getResult().equals("success")) {
                return true;
            }
        }

        if (signupServices.equals(OauthServiceCodeEnum.GOOGLE.getSignupServices())) {
            ResponseEntity<String> resultGoogle = restTemplate.exchange(apiURL, HttpMethod.POST, requestEntity, String.class);
            log.info("{}({}) : ApiResponse : ({}){}", signupServices, apiURL, resultGoogle.getStatusCode(), resultGoogle.getBody());
            if (resultGoogle.getStatusCode() == HttpStatus.OK) {
                return true;
            }
        }

        return false;
    }
}
