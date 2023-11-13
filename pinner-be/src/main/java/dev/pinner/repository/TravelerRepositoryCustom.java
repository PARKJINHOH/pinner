package dev.pinner.repository;


public interface TravelerRepositoryCustom {
    boolean updateTravelerStateByTravelerEmail(Long travelerId);
    boolean updateTravelerPasswordByTravelerEmail(String email, String password);
}
