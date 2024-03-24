package dev.pinner.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Comment;

import javax.persistence.*;
import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper=false) // 별도로 구현하는 VO가 없을 경우 추가
@Entity(name = "REFRESH_TOKEN")
public class RefreshToken extends AuditEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Comment("여행자")
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TRAVELER_ID", referencedColumnName = "id")
  private Traveler traveler;

  @Comment("관리자")
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ADMIN_ID" , referencedColumnName = "id")
  private Admin admin;

  @Comment("토근")
  @Column(nullable = false, unique = true)
  private String token;

  @Comment("만료시간")
  @Column(nullable = false)
  private Instant expiryDate;

  public RefreshToken() {
  }

}
