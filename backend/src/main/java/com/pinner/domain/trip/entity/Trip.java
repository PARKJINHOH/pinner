package com.pinner.domain.trip.entity;

import com.pinner.domain.day.entity.TripDay;
import com.pinner.domain.user.entity.User;
import com.pinner.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(
        name = "trips",
        indexes = {
                @Index(name = "idx_trips_user_id", columnList = "user_id"),
                @Index(name = "idx_trips_user_sort", columnList = "user_id, sort_order, deleted_at")
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Trip extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "is_shared", nullable = false)
    private boolean shared;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<TripDay> tripDays = new ArrayList<>();

    private Trip(User user, String title) {
        this.user = user;
        this.title = title;
        this.sortOrder = 0;
        this.shared = false;
    }

    public static Trip of(User user, String title) {
        return new Trip(user, title);
    }

    public void updateTitle(String title) {
        this.title = title;
    }

    public void updateSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public void updatePeriod(LocalDate startDate, LocalDate endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
