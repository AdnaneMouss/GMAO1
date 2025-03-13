package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Etage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtageRepository extends JpaRepository<Etage, Long> {
    Etage findById(long id);

    boolean existsByNumAndBatimentId(int num, Long batimentId);

    Etage findByNum(int i);

    Etage findByNumAndBatimentIntitule(int etageNum, String batimentNom);
}
