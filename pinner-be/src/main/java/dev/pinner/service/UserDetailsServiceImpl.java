package dev.pinner.service;

import dev.pinner.domain.entity.Traveler;
import dev.pinner.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final TravelerRepository travelerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Traveler getTraveler = travelerRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));

        log.info("Attempt Login Traveler : {}", getTraveler.getEmail());

        return getTraveler;
    }
}
