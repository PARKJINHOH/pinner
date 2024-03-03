package dev.pinner.config;

import dev.pinner.filter.AuthTokenFilter;
import dev.pinner.security.AuthenticationEntryPointImpl;
import dev.pinner.security.CustomAccessDeniedHandler;
import dev.pinner.security.jwt.JwtUtils;
import dev.pinner.service.CustomDetailsServiceImpl;
import dev.pinner.service.oauth.CustomOAuth2UserService;
import dev.pinner.service.oauth.OAuth2LoginFailureHandler;
import dev.pinner.service.oauth.OAuth2LoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomDetailsServiceImpl customDetailsService;
    private final JwtUtils jwtUtils;
    private final AuthenticationEntryPointImpl unauthorizedHandler;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;

    /*
     * Note
     * Deprecate WebSecurityConfigurerAdapter
     * https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter
     */

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web
                .ignoring().antMatchers("/actuator/**");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // @formatter:off
        // http Settings
        http
                .httpBasic().disable()
                .csrf().disable()
                .headers(headers -> headers.frameOptions().sameOrigin()) // h2-console 사용
                .formLogin().disable()
                .logout().disable()
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler); // 무단 요청에 대한 리다이렉션 설정

        // Session Settings
        http
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS); // 세션 비활성화

        // 권한 부여 규칙 Settings (antMatchers 순서 유의하기)
        http
                .authorizeRequests()
                    .antMatchers("/api/v1/admin/login").permitAll()
                    .antMatchers("/api/v1/admin/**").hasRole("ADMIN")
                    .antMatchers("/api/v1/travel/**", "/api/v1/journey/**").hasRole("USER")
                    .antMatchers("/**").permitAll()
                    .requestMatchers(PathRequest.toH2Console()).permitAll() // h2-console, favicon.ico 요청 인증 무시
                .and()
                    .exceptionHandling()
                    .accessDeniedHandler(accessDeniedHandler());

        // oAuth Settings
        http
                .oauth2Login()
                    .userInfoEndpoint()
                        .userService(customOAuth2UserService)
                .and()
                    .successHandler(oAuth2LoginSuccessHandler)
                    .failureHandler(oAuth2LoginFailureHandler);

        // JWT Filter Setting
        http
                .addFilterBefore(new AuthTokenFilter(jwtUtils, customDetailsService), UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests()
                .antMatchers("/api/v1/admin/**").permitAll()
        ;

        return http.build();
        // @formatter:on
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder encodePassword() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }
}