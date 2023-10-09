package dev.pinner;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.global.Role;
import dev.pinner.repository.TravelerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

@Slf4j
@Component
public class TestIdDataLoader implements ApplicationRunner {
    @Value("${spring.profiles.active}")
    private String profiles;

    @Value("${path.image}")
    private String imagePath;

    private final TravelerRepository travelerRepository;
    private final PasswordEncoder passwordEncoder;

    public TestIdDataLoader(TravelerRepository travelerRepository, PasswordEncoder passwordEncoder) {
        this.travelerRepository = travelerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        if(profiles.equals("local") || profiles.equals("dev")){
            // Test 계정 생성
            Traveler testId = Traveler.builder()
                    .email("test@naver.com")
                    .name("test")
                    .password(passwordEncoder.encode("test"))
                    .role(Role.USER)
                    .signupServices("Web")
                    .lastLoginIpAddress("127.0.0.1")
                    .build();
            travelerRepository.save(testId);

            // 기존 이미지 폴더 삭제
            if(profiles.equals("local")){
                String path = imagePath + File.separator;
                Path directory = Path.of(path);
                try {
                    Files.walk(directory)
                            .sorted(Comparator.reverseOrder())
                            .map(Path::toFile)
                            .forEach(File::delete);
                } catch (Exception e) {
                    log.error("폴더가 없습니다.");
                } finally {
                    File file = new File(path);
                    if (!file.exists()) {
                        boolean wasSuccessful = file.mkdirs();

                        if (!wasSuccessful) {
                            log.error("file: was not successful");
                        }
                    }
                }
            }
        }
    }
}