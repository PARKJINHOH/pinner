package com.example.travelmaprecodebe.domain.security;

import com.example.travelmaprecodebe.domain.traveler.Traveler;
import com.example.travelmaprecodebe.domain.traveler.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final TravelerRepository travelerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Traveler getTraveler = travelerRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));

        log.info("Attempt Login Traveler : {}", getTraveler.getEmail());

        return getTraveler;
    }
}
