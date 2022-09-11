package com.example.travelmaprecodebe.domain.entity;

import com.example.travelmaprecodebe.domain.AuditEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@Table(name = "HASHTAG")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HashTag extends AuditEntity {

    @Id
    @Column(name = "HASHTAG_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JOURNEY_ID")
    private HashTag hashTag;

    @Builder
    public HashTag(String tag, HashTag hashTag) {
        this.tag = tag;
        this.hashTag = hashTag;
    }
}
