package com.example.travelmaprecodebe.domain.traveler;

import com.sun.istack.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.example.travelmaprecodebe.domain.global.Role;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "tbl_travel")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Traveler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String email;

    @NotNull
    private String name;

    @NotNull
    private String password;

    private String state;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder
    public Traveler(String email, String password, String name, Role role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
    }

    public String getRoleKey() {
        return role.getKey();
    }
}
