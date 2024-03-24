package dev.pinner.security.jwt;

import dev.pinner.global.enums.JwtCodeEnum;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
public class JwtUtils {

    @Value("${token.app.jwtSecret}")
    private String jwtSecret;

    @Value("${token.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    /**
     * JWT Token 생성
     */
    public String generateToken(String email) {
        JwtBuilder jwtBuilder = Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE) // Header의 Type 지정
                .setIssuer("pinner") // Token 발급자
                .setIssuedAt(new Date()) // 발급 시간
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs)) // 만료 시간
                .setSubject(email); // Token 제목(대상)

        return jwtBuilder
                .signWith(SignatureAlgorithm.HS256, jwtSecret) // 해싱 알고리즘 및 시크릿 키
                .compact();
    }

    public String getEmailFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public JwtCodeEnum validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return JwtCodeEnum.ACCESS;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
            return JwtCodeEnum.INVALID;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return JwtCodeEnum.INVALID;
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
            return JwtCodeEnum.EXPIRED;
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
            return JwtCodeEnum.DENIED;
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
            return JwtCodeEnum.DENIED;
        }
    }

}
