package com.example.travelmaprecodebe.security.oauth;


import com.example.travelmaprecodebe.domain.entity.Traveler;
import com.example.travelmaprecodebe.security.jwt.JwtUtils;
import com.example.travelmaprecodebe.security.jwt.RefreshTokenService;
import com.example.travelmaprecodebe.service.OAuthAfterLoginService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final OAuthAfterLoginService afterLoginService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 Login 성공!");
        try {
            Traveler traveler = ((ICustomUser) authentication.getPrincipal()).getTraveler();
            String ticket = afterLoginService.put(traveler.getId());

            UriComponents build = UriComponentsBuilder
                    .fromUri(URI.create("/afteroauth"))
                    .queryParam("ticket", ticket)
                    .build(true);

            response.sendRedirect(build.toUriString());
        } catch (Exception e) {
            throw e;
        }
    }
}