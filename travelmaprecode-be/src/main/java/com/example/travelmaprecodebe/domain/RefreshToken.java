package com.example.travelmaprecodebe.domain;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

@Data
@Entity(name = "tbl_refreshtoken")
public class RefreshToken {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @OneToOne
  @JoinColumn(name = "email", referencedColumnName = "email")
  private Traveler traveler;

  @Column(nullable = false, unique = true)
  private String token;

  @Column(nullable = false)
  private Instant expiryDate;

  public RefreshToken() {
  }

}
