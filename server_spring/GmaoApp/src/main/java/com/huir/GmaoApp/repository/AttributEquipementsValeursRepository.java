package com.huir.GmaoApp.repository;
import com.huir.GmaoApp.model.AttributEquipementValeur;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttributEquipementsValeursRepository extends JpaRepository<AttributEquipementValeur, Long> {

    AttributEquipementValeur findByEquipementAndAttributEquipement(Equipement equipement, AttributEquipements attribut);

    List<AttributEquipementValeur> findByEquipement(Equipement equipement);
}


