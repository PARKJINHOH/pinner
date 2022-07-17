package com.example.travelmaprecodebe.traveler;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "tbl_travel")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TravelerEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "state")
    private String state;

    @Column(name = "roleCd")
    private String roleCd;

}
