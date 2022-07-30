package com.example.travelmaprecodebe.domain.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final OAuthTravelerService travelerService;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .antMatchers("/static/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        System.out.println("1234567890");
        http
                .authorizeRequests(
                        registry -> registry
                                .antMatchers(HttpMethod.POST, "/api/login/**").permitAll() // To avoid security,
                                .antMatchers("/", "/login/oauth2/**", "/login/**").permitAll()
                                .anyRequest().authenticated()
                )
                .oauth2Login(
                        oauth -> oauth
                                .userInfoEndpoint(userInfo -> userInfo.userService(travelerService))
                                .defaultSuccessUrl("/", true)
                );

    }
}
