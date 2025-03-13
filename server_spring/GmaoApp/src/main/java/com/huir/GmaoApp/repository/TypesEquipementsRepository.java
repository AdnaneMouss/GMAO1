package com.huir.GmaoApp.repository;
import com.huir.GmaoApp.model.TypesEquipements;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypesEquipementsRepository extends JpaRepository<TypesEquipements, Long> {
    TypesEquipements findById(long id);

    boolean existsByType(String type);

    Optional<TypesEquipements> findByType(String type);

}

