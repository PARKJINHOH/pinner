package com.example.travelmaprecodebe.domain.traveler;

import com.example.travelmaprecodebe.domain.global.AuditEntity;
import com.example.travelmaprecodebe.domain.global.Role;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Table(name = "tbl_travel")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Traveler extends AuditEntity {

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
        this.state = "U";
    }

    public String getRoleKey() {
        return role.getKey();
    }
}
