package dev.pinner.filter;

import dev.pinner.global.enums.JwtCodeEnum;
import dev.pinner.security.jwt.JwtUtils;
import dev.pinner.service.CustomDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {
    static final String _MDC_KEY = "user";

    private final JwtUtils jwtUtils;
    private final CustomDetailsServiceImpl customDetailsService;

    // Spring Security 흐름
    // https://www.bezkoder.com/spring-boot-login-example-mysql/


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            log.info("요청을 인증 중 : {}", request.getRequestURI());
            String jwt = parseJwt(request);
            String key = jwtUtils.validateJwtToken(jwt).getKey();
            String requestURI = request.getRequestURI();

            if (jwt != null && key.equals(JwtCodeEnum.ACCESS.getKey())) {
                String email = jwtUtils.getEmailFromJwtToken(jwt);
                MDC.put(_MDC_KEY, email);

                UserDetails userDetails = customDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove(_MDC_KEY);
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}
