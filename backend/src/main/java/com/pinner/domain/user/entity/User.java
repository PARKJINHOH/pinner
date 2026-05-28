package com.pinner.domain.user.entity;

import com.pinner.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "uk_users_email", columnList = "email", unique = true),
                @Index(name = "uk_users_provider", columnList = "provider, provider_id", unique = true)
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "nickname", nullable = false, length = 50)
    private String nickname;

    @Column(name = "provider", nullable = false, length = 20)
    private String provider;

    @Column(name = "provider_id", length = 255)
    private String providerId;

    @Column(name = "is_demo", nullable = false)
    private boolean isDemo = false;

    private User(String email, String password, String nickname, String provider, String providerId, boolean isDemo) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.provider = provider;
        this.providerId = providerId;
        this.isDemo = isDemo;
    }

    public static User of(String email, String encodedPassword, String nickname) {
        return new User(email, encodedPassword, nickname, "local", null, false);
    }

    public static User ofOAuth(String email, String nickname, String provider, String providerId) {
        return new User(email, null, nickname, provider, providerId, false);
    }

    public static User ofDemo(String email, String encodedPassword, String nickname) {
        return new User(email, encodedPassword, nickname, "local", null, true);
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}
