package dev.pinner.service;

import dev.pinner.domain.dto.AdminDto;
import dev.pinner.domain.entity.Admin;
import dev.pinner.domain.entity.RefreshToken;
import dev.pinner.exception.BusinessException;
import dev.pinner.exception.SystemException;
import dev.pinner.repository.AdminRepository;
import dev.pinner.repository.TravelerRepository;
import dev.pinner.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final TravelerRepository travelerRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public AdminDto.Response doLogin(AdminDto.Request adminDto) {

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(adminDto.getEmail(), adminDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            Admin admin = (Admin) authentication.getPrincipal();


            RefreshToken refreshToken = refreshTokenService.createRefreshToken("admin", admin.getEmail());
            String accessToken = jwtUtils.generateToken(admin.getUsername());

            Optional<Admin> optionalTraveler = adminRepository.findById(admin.getId());
//            optionalTraveler.ifPresent(getAdmin -> {
//                getAdmin.updateLastLoginIpAddress(CommonUtil.getIpAddress());
//                getAdmin.updateLastLoginDate();
//                getAdmin.initLoginFailureCount();
//            });

            return AdminDto.Response.builder()
                    .email(admin.getEmail())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .adminName(admin.getAdminName())
                    .build();

        } catch (LockedException ex) {
            throw new SystemException(HttpStatus.FORBIDDEN, "관리자 계정이 잠겨있습니다.", ex);
        } catch (BadCredentialsException ex) {
            Optional<Admin> optionalTraveler = adminRepository.findByEmail(adminDto.getEmail());
//            optionalTraveler.ifPresent(Admin::addLoginFailureCount);
            throw new SystemException(HttpStatus.FORBIDDEN, "비밀번호가 잘못되었습니다.", ex);
        } catch (InternalAuthenticationServiceException ex) {
            throw new SystemException(HttpStatus.NOT_FOUND, "이메일을 다시 한번 확인해주세요.", ex);
        } catch (Exception ex) {
            throw new SystemException(HttpStatus.INTERNAL_SERVER_ERROR, "로그인에 실패했습니다. 관리자에게 문의해주세요.", ex);
        }

    }

    @Transactional
    public AdminDto.Response getRefreshToken(AdminDto.Request adminDto) {
        String requestRefreshToken = adminDto.getRefreshToken();

        // Refresh Token
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken).orElseThrow(() -> {
            log.error("[{}] Token이 DB에 없습니다.", requestRefreshToken);
            return new BusinessException(HttpStatus.UNAUTHORIZED, "비정상적인 접근입니다.");
        });
        RefreshToken validRefreshToken = refreshTokenService.verifyExpiration(refreshToken);

        // Access Token
        String validAccessToken = jwtUtils.generateToken(validRefreshToken.getTraveler().getEmail());

        return AdminDto.Response.builder()
                .refreshToken(validRefreshToken.getToken())
                .accessToken(validAccessToken)
                .build();

    }
}
