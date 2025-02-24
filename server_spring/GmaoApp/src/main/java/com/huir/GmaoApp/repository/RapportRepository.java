package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Rapport;
import com.huir.GmaoApp.model.TypeRapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, Long> {
    List<Rapport> findByType(TypeRapport type);
}
