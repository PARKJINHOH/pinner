package com.example.travelmaprecodebe.bulidinfo;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Getter
@Component
@PropertySource(value = {"classpath:git.properties"})
public class CustomGitProperties {
    @Value("${git.branch}")
    private String branch = "none";

    @Value("${git.commit.id}")
    private String commitId = "none";

    @Value("${git.commit.time}")
    private String commitTime = "none";
}
