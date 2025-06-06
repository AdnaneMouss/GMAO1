package com.huir.GmaoApp.repository;
import com.huir.GmaoApp.model.AttributEquipementValeur;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttributEquipementsValeursRepository extends JpaRepository<AttributEquipementValeur, Long> {

    Optional<AttributEquipementValeur> findByEquipementAndAttributEquipement(Equipement equipement, AttributEquipements attribut);

    List<AttributEquipementValeur> findByEquipement(Equipement equipement);

    Optional<AttributEquipementValeur> findByAttributEquipement(AttributEquipements attributEquipement);

    List<AttributEquipementValeur> findByEquipementId(Long id);
}


