package dev.pinner.config;

import dev.pinner.filter.AuthTokenFilter;
import dev.pinner.security.AuthenticationEntryPointImpl;
import dev.pinner.security.jwt.JwtUtils;
import dev.pinner.service.oauth.OAuth2LoginSuccessHandler;
import dev.pinner.service.oauth.CustomOAuth2UserService;
import dev.pinner.service.oauth.OAuth2LoginFailureHandler;
import dev.pinner.service.UserDetailsServiceImpl;
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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final UserDetailsServiceImpl userDetailsService;
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

        // 권한 부여 규칙 Settings
        http
                .authorizeRequests()
                .antMatchers("/**").permitAll()
//                .antMatchers("/actuator/**").permitAll() // 모니터링 관련
                .requestMatchers(PathRequest.toH2Console()).permitAll() // h2-console, favicon.ico 요청 인증 무시
                .anyRequest().authenticated();

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
                .addFilterBefore(new AuthTokenFilter(jwtUtils, userDetailsService), UsernamePasswordAuthenticationFilter.class);

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
}