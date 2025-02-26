package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ServicesRepository extends JpaRepository<Services, Long> {
    Services findByNom(String nom);
    boolean existsByNom(String nom);
}
