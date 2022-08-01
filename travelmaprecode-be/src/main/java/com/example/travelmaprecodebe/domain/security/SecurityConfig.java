package com.example.travelmaprecodebe.domain.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final OAuthTravelerService travelerService;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers("/static/**", "/h2-console/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable()
                .csrf().disable()
                .authorizeRequests()
                    .antMatchers(HttpMethod.POST, "/api/traveler/**").permitAll() // To avoid security,
                    .antMatchers("/", "/login/oauth2/**", "/api/traveler/**").permitAll()
                    .anyRequest().authenticated()
                .and()
                    .oauth2Login()
                    .userInfoEndpoint(userInfo -> userInfo.userService(travelerService))
                    .defaultSuccessUrl("/", true)
                .and()
                    .formLogin()
                    .loginPage("/login").permitAll()
                    .usernameParameter("email")
                    .successHandler(customAuthenticationSuccessHandler)
                    .failureHandler(customAuthenticationFailureHandler);
    }

    @Bean
    public BCryptPasswordEncoder encodePassword() {
        return new BCryptPasswordEncoder();
    }
}
