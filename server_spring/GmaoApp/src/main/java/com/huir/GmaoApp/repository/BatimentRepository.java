package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.CoutMaintenance;
import com.huir.GmaoApp.model.Intervention;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatimentRepository extends JpaRepository<Batiment, Long> {
Batiment findById(long id);

    boolean existsByIntitule(String intitule);
    boolean existsByNumBatiment(int numBatiment);

    Batiment findByIntitule(String batimentNom);
}
