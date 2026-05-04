package com.pinner.global.filter;

import com.pinner.domain.user.service.UserDetailsImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

public class DemoGuardFilter extends OncePerRequestFilter {

    private static final Set<String> BLOCKED_METHODS = Set.of("POST", "PUT", "PATCH", "DELETE");

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (BLOCKED_METHODS.contains(request.getMethod())) {
            String path = request.getRequestURI();
            // /api/auth/** 는 로그인·로그아웃·갱신 등 인증 흐름이므로 허용
            if (!path.startsWith("/api/auth/") && isDemoUser()) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write(
                        "{\"success\":false,\"data\":null,\"message\":\"데모 계정은 해당 기능을 사용할 수 없습니다\"}"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isDemoUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        if (auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
            return userDetails.isDemo();
        }
        return false;
    }
}
