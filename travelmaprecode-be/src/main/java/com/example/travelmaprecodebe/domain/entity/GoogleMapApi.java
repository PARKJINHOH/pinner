package com.example.travelmaprecodebe.domain.entity;

import com.example.travelmaprecodebe.domain.AuditEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "GOOGLEMAPAPIDATA")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GoogleMapApi extends AuditEntity {

    @Id
    @Column(name = "GOOGLEMAPAPIDATA_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO : google map api 불러오면
}
