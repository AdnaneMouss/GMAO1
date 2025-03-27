package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Equipement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {
    boolean existsByNumeroSerie(String numeroSerie);
    List<Equipement> findByServiceId(Long serviceId);
    Equipement findById(long id);

    Optional<Equipement> findByNom(String equipementNom);
}

