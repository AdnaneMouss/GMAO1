package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.AttributEquipementsDTO;
import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.AttributEquipementsValeursRepository;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.TypesEquipementsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttributEquipementsService {

    private final AttributEquipementsRepository attributEquipementsRepository;
    private final TypesEquipementsRepository typesEquipementsRepository;
    private final EquipementRepository equipementRepository;
;






    public List<AttributEquipementsDTO> getAttributesByTypeId(Long typeEquipementId) {
        return attributEquipementsRepository.findByTypeEquipementId(typeEquipementId)
                .stream()
                .map(AttributEquipementsDTO::new)
                .collect(Collectors.toList());
    }

    public AttributEquipements saveAttribut(AttributEquipements attr) {
        return attributEquipementsRepository.save(attr);
    }

    @Transactional
    public AttributEquipementsDTO updateAttr(Long id, AttributEquipementsDTO attrDTO) {
        Optional<AttributEquipements> optionalAttr = attributEquipementsRepository.findById(id);

        if (optionalAttr.isPresent()) {
            AttributEquipements attr = optionalAttr.get();

            // Check if the new name is already taken by another attribute
            boolean nameExists = attributEquipementsRepository.existsByNomAndTypeEquipementId(attrDTO.getNom(),attrDTO.getTypeEquipement().getId());
            if (nameExists && !attr.getNom().equals(attrDTO.getNom())) {
                throw new RuntimeException("Un attribut avec ce nom existe déjà.");
            }

            attr.setNom(attrDTO.getNom());
            attr.setActif(attrDTO.getActif());
            attr.setObligatoire(attrDTO.getObligatoire());

            AttributEquipementType attributEquipementType = AttributEquipementType.valueOf(attrDTO.getAttributEquipementType());
            attr.setAttributEquipementType(attributEquipementType);

            attributEquipementsRepository.save(attr);
            return new AttributEquipementsDTO(attr);
        } else {
            throw new RuntimeException("Attribut non trouvé avec ID : " + id);
        }
    }


    public boolean existsByNomAndTypeEquipementId(String nom, Long typeEquipementId) {
        return attributEquipementsRepository.existsByNomAndTypeEquipementId(nom, typeEquipementId);
    }
}
