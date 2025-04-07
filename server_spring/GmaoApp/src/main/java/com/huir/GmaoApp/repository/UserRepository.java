package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByGsm(String gsm);

    Optional<User> findByUsername(String username);

    Optional<User> findByGsm(String gsm);
}

