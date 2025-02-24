package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.OrdreTravail;
import com.huir.GmaoApp.model.StatutOrdre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdreTravailRepository extends JpaRepository<OrdreTravail, Long> {
    List<OrdreTravail> findByStatut(StatutOrdre statut);
}
