package dev.pinner.service.newOauth;

import dev.pinner.exception.CustomException;
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
            log.info("OAuth2 Login 성공!");
            CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
            String ticket = afterLoginService.put(oAuth2User.getId());

            UriComponents build = UriComponentsBuilder
                    .fromUri(URI.create("/afteroauth"))
                    .queryParam("ticket", ticket)
                    .build(true);

            response.sendRedirect(build.toUriString());
        } catch (Exception e) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "OAuth2 Login에 실패했습니다.");
        }
    }
}