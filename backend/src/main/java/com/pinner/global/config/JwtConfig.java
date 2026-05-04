package com.pinner.global.config;

import com.pinner.global.jwt.JwtProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({JwtProperties.class, DemoProperties.class})
public class JwtConfig {
}
