package dev.pinner.service.oauth;

import dev.pinner.exception.SystemException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
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
            if (authentication.getPrincipal() instanceof CustomOAuth2User) {
                CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
                ticket = afterLoginService.put(oAuth2User.getId());
            } else {
                // 예외 처리 로직
                // getprincipal()이 어떤건지 보고싶어서 추가한 로그
                log.error("authentication.getPrincipal() : " + authentication.getPrincipal());
                ticket = "";
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