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
            log.info("authentication.getPrincipal() : {}", authentication.getPrincipal());
            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
            log.info("oAuth2User : {}", oAuth2User);
            String ticket = afterLoginService.put(oAuth2User.getId());
            log.info("ticket : {}", ticket);

            UriComponents build = UriComponentsBuilder
                    .fromUri(URI.create("/afteroauth"))
                    .queryParam("ticket", ticket)
                    .build(true);

            response.sendRedirect(build.toUriString());
        } catch (Exception ex) {
            throw new SystemException(HttpStatus.INTERNAL_SERVER_ERROR, "OAuth2 Login에 실패했습니다.", ex);
        }
    }
}