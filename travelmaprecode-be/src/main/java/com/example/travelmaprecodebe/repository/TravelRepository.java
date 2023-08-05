package com.example.travelmaprecodebe.repository;

import com.example.travelmaprecodebe.domain.entity.Travel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelRepository extends JpaRepository<Travel, Long>, TravelRepositoryCustom {
}
