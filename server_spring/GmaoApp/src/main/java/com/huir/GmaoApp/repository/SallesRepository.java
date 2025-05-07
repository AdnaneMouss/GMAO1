package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import com.huir.GmaoApp.model.TypesEquipements;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SallesRepository extends JpaRepository<Salle, Long> {
    Salle findById(long id);

    boolean existsByNumAndEtageId(int num, Long etageId);

    List<Salle> findByActifTrue();

    List<Salle> findByActifFalse();

    Salle findByNum(int i);

    Salle findByNumAndEtageNum(int salleNum, int etageNum);

    List<Salle> findByEtageIdAndActifFalse(Long etageId);

    List<Salle> findByEtageIdAndActifTrue(Long etageId);

    boolean existsByPrefixeAndNumAndEtageIdAndActifTrue(String prefixe,Integer num, Long etageId);
}
