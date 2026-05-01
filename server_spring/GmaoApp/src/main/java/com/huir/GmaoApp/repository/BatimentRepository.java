package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.*;
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
    List<Batiment> findByActifTrue();

    List<Batiment> findByActifFalse();
    Batiment findByIntitule(String batimentNom);

    boolean existsByIntituleAndActifTrue(String intitule);

    boolean existsByNumBatimentAndActifTrue(int numBatiment);
}
