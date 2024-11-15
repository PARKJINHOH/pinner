package dev.pinner;

import dev.pinner.domain.entity.Admin;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.global.enums.RoleEnum;
import dev.pinner.repository.AdminRepository;
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
import java.time.LocalDateTime;
import java.util.Comparator;

@Slf4j
@Component
public class TestIdDataLoader implements ApplicationRunner {
    @Value("${spring.profiles.active}")
    private String profiles;

    @Value("${path.image}")
    private String imagePath;

    private final TravelerRepository travelerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public TestIdDataLoader(TravelerRepository travelerRepository, AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.travelerRepository = travelerRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        if(profiles.equals("local") || profiles.equals("dev")){
            // Test 계정 생성
            Traveler testId = Traveler.builder()
                    .email("test@naver.com")
                    .nickname("테스트계정")
                    .password(passwordEncoder.encode("test"))
                    .roleEnum(RoleEnum.USER)
                    .signupServices("web")
                    .lastLoginIpAddress("127.0.0.1")
                    .build();

            if (travelerRepository.findByEmail(testId.getEmail()).isEmpty()) {
                travelerRepository.save(testId);
            }

            Traveler testId2 = Traveler.builder()
                    .email("test2@naver.com")
                    .nickname("테스트계정2")
                    .password(passwordEncoder.encode("test"))
                    .roleEnum(RoleEnum.USER)
                    .signupServices("web")
                    .state(false)
                    .lockedDate(LocalDateTime.now())
                    .lastLoginIpAddress("127.0.0.1")
                    .build();

            if (travelerRepository.findByEmail(testId2.getEmail()).isEmpty()) {
                travelerRepository.save(testId2);
            }

            // Test Admin 계정 생성
            Admin testAdminId = Admin.builder()
                    .email("admin@naver.com")
                    .adminName("테스트관리자")
                    .password(passwordEncoder.encode("admin"))
                    .roleEnum(RoleEnum.ADMIN)
                    .lastLoginIpAddress("127.0.0.1")
                    .build();

            if (adminRepository.findByEmail(testAdminId.getEmail()).isEmpty()) {
                adminRepository.save(testAdminId);
            }

            // 기존 이미지 폴더 삭제
            if(profiles.equals("local")){
                String path = imagePath + File.separator;
                Path directory = Path.of(path);
                try {
                    // 디텍토리 내부의 모든 파일과 하위 디렉토리를 역순으로 정렬하고 삭제
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