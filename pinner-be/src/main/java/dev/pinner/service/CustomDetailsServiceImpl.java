package dev.pinner.service;

import dev.pinner.domain.entity.Admin;
import dev.pinner.domain.entity.Traveler;
import dev.pinner.exception.BusinessException;
import dev.pinner.repository.AdminRepository;
import dev.pinner.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomDetailsServiceImpl implements UserDetailsService {

    private final TravelerRepository travelerRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String uri = request.getRequestURI();

        if (uri.contains("/admin")) {
            Optional<Admin> adminOptional = adminRepository.findByEmail(email);
            if (adminOptional.isPresent()) {
                return adminOptional.get();
            }
        } else {
            Optional<Traveler> travelerOptional = travelerRepository.findByEmail(email);
            if (travelerOptional.isPresent()) {
                return travelerOptional.get();
            }
        }

        throw new BusinessException(HttpStatus.NOT_FOUND, email + "를 찾을 수 없습니다.");
    }
}
