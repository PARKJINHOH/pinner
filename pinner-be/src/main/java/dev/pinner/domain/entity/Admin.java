package dev.pinner.domain.entity;

import dev.pinner.global.enums.RoleEnum;
import lombok.*;
import org.hibernate.annotations.Comment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Builder
@Table(name = "ADMIN")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Admin extends AuditEntity implements UserDetails {
    @Id
    @Column(name = "ADMIN_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(length = 320, unique = true)
    @Comment("이메일")
    private String email;

    @NotNull
    @Column(length = 225)
    @Comment("비밀번호")
    private String password;

    @NotNull
    @Column(length = 30)
    @Comment("이름")
    private String adminName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Comment("권한")
    private RoleEnum roleEnum;

    @NotNull
    @Comment("계정 상태")
    @Builder.Default // 객체생성시 초기값(@ColumnDefault는 DDL에 포함될 컬럼의 기본값을 지정하고 싶을때 사용), 혹은 유저 생성시 builder 로 넣는게 좋아보이며 여러 방법이 있음.
    private Boolean state = true;

    @NotNull
    @Column(length = 10)
    @Comment("로그인 실패 횟수")
    private int loginFailureCount;

    @NotNull
    @Comment("마지막 로그인 날짜")
    private LocalDateTime lastLoginDate;

    @NotNull
    @Comment("마지막 비밀번호 변경 날짜")
    private LocalDateTime lastChangePasswordDate;

    @NotNull
    @Comment("마지막 로그인 IP 주소")
    private String lastLoginIpAddress;

    @PrePersist
    public void onCreate() {
        // 엔티티가 생성될 때 초기화
        this.lastLoginDate = LocalDateTime.now();
        this.lastChangePasswordDate = LocalDateTime.now();
    }

    // 사용자 권한을 반환,
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        ArrayList<GrantedAuthority> auth = new ArrayList<>();
        auth.add(new SimpleGrantedAuthority(roleEnum.getKey()));
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