package com.example.travelmaprecodebe.traveler.register;

import com.example.travelmaprecodebe.traveler.TravelerEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RegisterSerivce {
    private final RegisterRepository registerRepository;

    public boolean getCheckEmail(String email) {
        final Optional<TravelerEntity> byEmail = registerRepository.findByEmail(email);
        if (byEmail.isPresent()) {
            log.info("Check Email : {}", byEmail.get().getEmail());
            return false;
        } else {
            return true;
        }
    }
}
