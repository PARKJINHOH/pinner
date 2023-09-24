package com.example.travelmaprecodebe.config;

import com.example.travelmaprecodebe.security.jwt.AuthTokenFilter;
import com.example.travelmaprecodebe.security.jwt.AuthenticationEntryPointImpl;
import com.example.travelmaprecodebe.security.jwt.JwtUtils;
import com.example.travelmaprecodebe.security.oauth.OAuth2LoginSuccessHandler;
import com.example.travelmaprecodebe.security.oauth.OAuthTravelerServiceImpl;
import com.example.travelmaprecodebe.security.oauth.OcidTravelerServiceImpl;
import com.example.travelmaprecodebe.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final OAuthTravelerServiceImpl oAuthTravelerServiceImpl;
    private final OcidTravelerServiceImpl ocidTravelerServiceImpl;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtils jwtUtils;
    private final AuthenticationEntryPointImpl unauthorizedHandler;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(encodePassword());
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers("/h2-console/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
                .httpBasic().disable()
                .csrf().disable()
                .formLogin().disable()
                .logout().disable()
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler)
                .and()
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)	// 세션 비활성화

                .and()
                    .authorizeRequests()
                        .antMatchers("/", "/error", "/api/v1/traveler/**",  "/photo/**").permitAll()
                        .anyRequest().authenticated()

                .and()
                    .oauth2Login()
                        .userInfoEndpoint()
                            .userService(oAuthTravelerServiceImpl)
                            .oidcUserService(ocidTravelerServiceImpl)
                        .and()
                            .successHandler(oAuth2LoginSuccessHandler)

                .and()

                    .addFilterBefore(new AuthTokenFilter(jwtUtils, userDetailsService), UsernamePasswordAuthenticationFilter.class);
        // @formatter:on
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public BCryptPasswordEncoder encodePassword() {
        return new BCryptPasswordEncoder();
    }
}
