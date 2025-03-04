package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.TypesEquipementsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TypesEquipementsService {

    @Autowired
    private TypesEquipementsRepository typesEquipementsRepository;

    @Autowired
    private AttributEquipementsRepository attributEquipementsRepository;  // Add the repository for AttributEquipements

    public List<AttributEquipements> getAttributesByTypeId(long typeequipementId) {
        TypesEquipements equipement = typesEquipementsRepository.findById(typeequipementId);
        if (equipement != null) {
            return equipement.getAttributs(); // Returns the list of piecesDetachees
        }
        return Collections.emptyList(); // If equipement is not found, return an empty list
    }


    public List<TypesEquipements> getAllTypesEquipements() {
        return typesEquipementsRepository.findAll();
    }


    public TypesEquipements saveType(TypesEquipements type) {
        return typesEquipementsRepository.save(type);
    }

    public boolean existsByType(String type) {
        return typesEquipementsRepository.existsByType(type);
    }
}
