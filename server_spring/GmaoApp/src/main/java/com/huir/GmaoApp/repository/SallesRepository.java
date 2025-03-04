package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SallesRepository extends JpaRepository<Salle, Long> {
    Salle findById(long id);

    boolean existsByNumAndEtageId(int num, Long etageId);
}
