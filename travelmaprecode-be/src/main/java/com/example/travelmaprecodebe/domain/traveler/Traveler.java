package com.example.travelmaprecodebe.domain.traveler;

import com.sun.istack.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "tbl_travel")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Traveler {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "email")
    private String email;

    @NotNull
    @Column(name = "password")
    private String password;

    @Column(name = "state")
    private String state;

    @Column(name = "roleCd")
    private String roleCd;

    @Builder
    public Traveler(String email, String password, String state, String roleCd) {
        this.email = email;
        this.password = password;
        this.state = state;
        this.roleCd = roleCd;
    }
}
