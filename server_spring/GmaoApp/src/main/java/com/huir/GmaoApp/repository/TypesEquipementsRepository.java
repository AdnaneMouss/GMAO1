package com.huir.GmaoApp.repository;
import com.huir.GmaoApp.model.TypesEquipements;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypesEquipementsRepository extends JpaRepository<TypesEquipements, Long> {
    TypesEquipements findById(long id);

    boolean existsByType(String type);
}

