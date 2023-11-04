package dev.pinner.domain.entity;

import lombok.Data;
import org.hibernate.annotations.Comment;

import javax.persistence.*;
import java.time.Instant;

@Data
@Entity(name = "tbl_refreshtoken")
public class RefreshToken extends AuditEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Comment("여행자")
  @OneToOne
  @JoinColumn(name = "email", referencedColumnName = "email")
  private Traveler traveler;

  @Comment("토근")
  @Column(nullable = false, unique = true)
  private String token;

  @Comment("만료시간")
  @Column(nullable = false)
  private Instant expiryDate;

  public RefreshToken() {
  }

}
