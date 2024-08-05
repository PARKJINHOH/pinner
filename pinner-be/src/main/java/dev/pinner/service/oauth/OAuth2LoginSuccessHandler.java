package dev.pinner.service.oauth;

import dev.pinner.exception.BusinessException;
import dev.pinner.exception.SystemException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final OAuthAfterLoginService afterLoginService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        try {
            String ticket;
            if (authentication.getPrincipal() instanceof CustomOAuth2User oAuth2User) {
                ticket = afterLoginService.put(oAuth2User.getId());
            } else if (authentication.getPrincipal() instanceof DefaultOAuth2User oAuth2User) {
                ticket = afterLoginService.put(Long.parseLong(oAuth2User.getAttribute("id").toString()));
            } else if (authentication.getPrincipal() instanceof User) {
                User user = (User) authentication.getPrincipal();
                ticket = afterLoginService.put(Long.parseLong(user.getUsername()));
            } else {
                // 예외 처리 로직
                log.error("authentication.getPrincipal() : {}", authentication.getPrincipal());
                throw new BusinessException(HttpStatus.UNAUTHORIZED, "authentication.getPrincipal() 타입이 맞지 않습니다.");
            }

            UriComponents build = UriComponentsBuilder
                    .fromUri(URI.create("/afteroauth"))
                    .queryParam("ticket", ticket)
                    .build(true);

            log.info("OAuth2 Login 성공!");
            response.sendRedirect(build.toUriString());
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new SystemException(HttpStatus.INTERNAL_SERVER_ERROR, "OAuth2 Login에 실패했습니다.", e);
        }
    }
}