package dev.pinner;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.persistence.EntityManager;

@EnableJpaAuditing
@SpringBootApplication
public class PinnerBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(PinnerBeApplication.class, args);
    }

    @Bean
    JPAQueryFactory jpaQueryFactory(EntityManager em) {
        return new JPAQueryFactory(em);
    }

    @Value("${spring.profiles.active}")
    private String profiles;



    @Bean
    public WebMvcConfigurer corsConfigurer() {
        if(profiles.equals("local")){
            return new WebMvcConfigurer() {
                @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**").allowedOrigins("http://localhost:3000/");
                }
            };
        } else {
            System.out.println("dev");
            return null;
        }
    }

}
