package com.example.travelmaprecodebe.domain.entity;

import com.example.travelmaprecodebe.domain.AuditEntity;
import com.example.travelmaprecodebe.global.Role;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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
    @Comment("이메일")
    private String email;

    @NotNull
    @Comment("비밀번호 OR OauthAccessToken")
    private String password;

    @NotNull
    @Comment("닉네임")
    private String name;

    @NotNull
    @Comment("가입경로")
    private String signupServices;

    @NotNull
    @Enumerated(EnumType.STRING)
    @ColumnDefault("true")
    @Comment("권한")
    private Role role;

    @Comment("계정 상태")
    private boolean state;

    @Comment("로그인 실패 횟수")
    @ColumnDefault("0")
    private int loginFailureCount;

    @Comment("마지막 로그인 날짜")
    private LocalDateTime lastLoginDate;

    @Comment("마지막 비밀번호 변경 날짜")
    private LocalDateTime lastChangePasswordDate;

    @Comment("마지막 로그인 IP 주소")
    private String lastLoginIpAddress;


    @OneToMany(mappedBy = "traveler", cascade = CascadeType.ALL)
    private List<Travel> travels = new ArrayList<>();

    @Builder
    public Traveler(String email, String password, String name, String signupServices, String lastLoginIpAddress, Role role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.signupServices = signupServices;
        this.role = role;
        this.lastLoginIpAddress = lastLoginIpAddress;
        this.state = true;
    }

    @PrePersist
    public void onCreate() {
        // 엔티티가 생성될 때 초기화
        this.lastLoginDate = LocalDateTime.now();
        this.lastChangePasswordDate = LocalDateTime.now();
    }

    public void addTravel(String title) {
        int newOrder = travels.size(); // 0부터 시작
        Travel travel = new Travel(this, title, newOrder);
        travels.add(travel);
    }

    public void updateLastLoginDate() {
        this.lastLoginDate = LocalDateTime.now();
    }

    public void updateOauthAccessToken(String accesstoken) {
        this.password = accesstoken;
    }

    public void updateLastLoginIpAddress(String ipAddress) {
        this.lastLoginIpAddress = ipAddress;
    }

    public void updateLastChangePasswordDate() {
        lastChangePasswordDate = LocalDateTime.now();
    }

    public void addLoginFailureCount() {
        this.loginFailureCount++;
    }

    public void initLoginFailureCount() {
        this.loginFailureCount = 0;
    }

    public void updateNickname(String nickname) {
        this.name = nickname;
    }
    public void updatePassword(String password) {
        this.password = password;
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
