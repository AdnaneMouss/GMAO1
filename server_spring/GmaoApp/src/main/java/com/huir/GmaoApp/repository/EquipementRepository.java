package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {
    boolean existsByNumeroSerie(String numeroSerie);
    List<Equipement> findByServiceIdAndActifTrue(Long serviceId);
    Equipement findById(long id);

    Optional<Equipement> findByNom(String equipementNom);
    
    Optional<Equipement> findTopByOrderByIdDesc();

    List<Equipement> findBySalleIdAndActifTrue(Long salleId);

    boolean existsByTypeEquipement(TypesEquipements type);

    boolean existsByBatiment(Batiment batiment);

    boolean existsByEtage(Etage etage);

    boolean existsBySalle(Salle salle);

    boolean existsByService(Services service);
}

