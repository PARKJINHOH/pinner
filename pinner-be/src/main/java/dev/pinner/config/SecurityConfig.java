package dev.pinner.config;

import dev.pinner.service.jwt.AuthTokenFilter;
import dev.pinner.service.jwt.AuthenticationEntryPointImpl;
import dev.pinner.service.jwt.JwtUtils;
import dev.pinner.service.oauth.OAuth2LoginSuccessHandler;
import dev.pinner.service.oauth.OAuthTravelerServiceImpl;
import dev.pinner.service.oauth.OcidTravelerServiceImpl;
import dev.pinner.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
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

    private final OAuthTravelerServiceImpl oAuthTravelerServiceImpl;
    private final OcidTravelerServiceImpl ocidTravelerServiceImpl;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtils jwtUtils;
    private final AuthenticationEntryPointImpl unauthorizedHandler;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    /*
     * Note
     * Deprecate WebSecurityConfigurerAdapter
     * https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter
     */

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web
                .ignoring().antMatchers("/h2-console/**");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // @formatter:off
        // http Settings
        http
                .httpBasic().disable()
                .csrf().disable()
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
                .antMatchers("/", "/error", "/api/v1/public/**","/api/v1/traveler/**", "/api/v1/email/**", "/photo/**").permitAll()
                .anyRequest().authenticated();

        // oAuth Settings
        http
                .oauth2Login()
                    .userInfoEndpoint()
                        .userService(oAuthTravelerServiceImpl)
                        .oidcUserService(ocidTravelerServiceImpl)
                .and()
                    .successHandler(oAuth2LoginSuccessHandler);

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