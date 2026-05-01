package com.huir.GmaoApp.repository;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.TypesEquipements;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttributEquipementsRepository extends JpaRepository<AttributEquipements, Long> {
    List<AttributEquipements> findByTypeEquipementId(Long typeEquipementId);
    boolean existsByNomAndTypeEquipementId(String nom,Long typeEquipementId);
    Optional<AttributEquipements> findByNom(String nom);

    List<AttributEquipements> findByTypeEquipement(TypesEquipements typeEquipement);
}


