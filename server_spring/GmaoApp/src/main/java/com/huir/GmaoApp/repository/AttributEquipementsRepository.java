package com.huir.GmaoApp.repository;
import com.huir.GmaoApp.model.AttributEquipements;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttributEquipementsRepository extends JpaRepository<AttributEquipements, Long> {
    List<AttributEquipements> findByTypeEquipementId(Long typeEquipementId);
    boolean existsByNomAndTypeEquipementId(String nom,Long typeEquipementId);
}


