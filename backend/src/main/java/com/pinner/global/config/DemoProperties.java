package com.pinner.global.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "demo")
public class DemoProperties {

    private String email;
    private String password;
    private String nickname = "데모 사용자";
}
