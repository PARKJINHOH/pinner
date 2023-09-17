package com.example.travelmaprecodebe.domain.entity;

import com.example.travelmaprecodebe.domain.AuditEntity;
import com.example.travelmaprecodebe.domain.dto.TravelerDto;
import com.example.travelmaprecodebe.global.Role;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Entity
@Getter
@Table(name = "TRAVELER")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Traveler extends AuditEntity implements UserDetails {

    @Id
    @JoinColumn(name = "TRAVELER_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String email;

    @NotNull
    private String password;

    @NotNull
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean state;


    @OneToMany(mappedBy = "traveler", cascade = CascadeType.ALL)
    private List<Travel> travels = new ArrayList<>();

    public void addTravel(String title) {
        int newOrder = travels.size(); // 0부터 시작
        Travel travel = new Travel(this, title, newOrder);
        travels.add(travel);
    }


    @Builder
    public Traveler(String email, String password, String name, Role role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
        this.state = true;
    }

    public void updateTraveler(TravelerDto.Request travelerDto) {
        this.name = Optional.ofNullable(travelerDto.getName()).orElse(this.name);
        this.password = Optional.ofNullable(travelerDto.getNewPassword()).orElse(this.password);
    }

    // 사용자 권한을 반환,
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        ArrayList<GrantedAuthority> auth = new ArrayList<>();
        auth.add(new SimpleGrantedAuthority(role.getKey()));
        return auth;
    }

    // 사용자의 id를 반환 (unique한 값)
    @Override
    public String getUsername() {
        return email;
    }

    // 사용자의 password를 반환
    @Override
    public String getPassword() {
        return password;
    }

    // 계정 만료 여부 반환
    @Override
    public boolean isAccountNonExpired() {
        // 만료되었는지 확인하는 로직
        return true; // true -> 만료되지 않았음
    }

    // 계정 잠금 여부 반환
    @Override
    public boolean isAccountNonLocked() {
        // 계정 잠금되었는지 확인하는 로직
        return state; // true -> 잠금되지 않았음
    }

    // 계정 사용 가능 여부 반환
    @Override
    public boolean isEnabled() {
        // 계정이 사용 가능한지 확인하는 로직
        return state;
    }

    // 패스워드의 만료 여부 반환
    @Override
    public boolean isCredentialsNonExpired() {
        // 패스워드가 만료되었는지 확인하는 로직
        return true; // true -> 만료되지 않았음
    }


}
