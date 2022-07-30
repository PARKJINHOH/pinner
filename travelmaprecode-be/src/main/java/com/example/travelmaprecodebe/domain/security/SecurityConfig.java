package com.example.travelmaprecodebe.domain.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
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
        http
                .authorizeRequests(
                        registry -> registry
                                .antMatchers("/", "/login/oauth2/**").permitAll()
                                .anyRequest().authenticated()
                )
                .oauth2Login(
                        oauth -> oauth
                                .userInfoEndpoint(
                                        userInfo -> userInfo.userService(travelerService)
                                )
                                .defaultSuccessUrl("/", true)
                );

    }
}
