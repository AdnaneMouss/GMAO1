package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Equipement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {
    boolean existsByNumeroSerie(String numeroSerie);
    List<Equipement> findByServiceId(Long serviceId);

}
