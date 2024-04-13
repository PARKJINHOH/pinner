package dev.pinner.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Comment;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper=false) // 별도로 구현하는 VO가 없을 경우 추가
@Entity(name = "REFRESH_TOKEN")
public class RefreshToken extends AuditEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TRAVELER_ID", referencedColumnName = "id")
  @Comment("여행자")
  private Traveler traveler;

  @NotNull
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ADMIN_ID" , referencedColumnName = "id")
  @Comment("관리자")
  private Admin admin;

  @NotNull
  @Column(nullable = false, unique = true)
  @Comment("토큰")
  private String token;

  @NotNull
  @Column(nullable = false)
  @Comment("만료시간")
  private Instant expiryDate;

  public RefreshToken() {
  }

}
