package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Role;
import com.huir.GmaoApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByGsm(String gsm);

    Optional<User> findByUsername(String username);

    Optional<User> findByGsm(String gsm);

    List<User> findByRole(Role role);

    long countByActif(boolean actif);
}

