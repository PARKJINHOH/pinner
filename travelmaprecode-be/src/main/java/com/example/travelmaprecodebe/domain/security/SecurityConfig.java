package com.example.travelmaprecodebe.domain.security;

import com.example.travelmaprecodebe.domain.security.jwt.JwtAuthenticationFilter;
import com.example.travelmaprecodebe.domain.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
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

    private final OAuthTravelerService oAuthTravelerService;
    private final JwtTokenProvider jwtTokenProvider;


    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
                .antMatchers("/h2-console/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable()
                .csrf().disable()
                .formLogin().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)	// 세션 비활성화

                .and()
                .authorizeRequests()
                    .antMatchers(HttpMethod.POST, "/api/traveler/**").permitAll() // To avoid security,
                    .antMatchers("/", "/login/oauth2/**", "/api/traveler/**", "/h2-console/**").permitAll()
                    .anyRequest().authenticated()

                .and()
                    .oauth2Login()
                    .userInfoEndpoint(userInfo -> userInfo.userService(oAuthTravelerService))
                    .defaultSuccessUrl("/", true)

                .and()
                    .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
        ;
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
