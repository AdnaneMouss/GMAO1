package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.AttributEquipementsDTO;
import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.AttributEquipementType;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.TypesEquipements;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.TypesEquipementsRepository;
import com.huir.GmaoApp.service.AttributEquipementsService;
import com.huir.GmaoApp.service.EquipementService;
import com.huir.GmaoApp.service.TypesEquipementsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/attributs-equipements")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AttributEquipementsController {

    private final AttributEquipementsService attributEquipementsService;

@Autowired
private final TypesEquipementsRepository typesEquipementsRepository;
@Autowired
private AttributEquipementsRepository attributEquipementsRepository;


    @GetMapping
public List<AttributEquipements> getAll() {
    return attributEquipementsRepository.findAll();
}



    @PostMapping
    public ResponseEntity<?> createAttributEquipement(@RequestBody AttributEquipementsDTO attrDTO) {
        if (attributEquipementsService.existsByNomAndTypeEquipementId(attrDTO.getNom(),attrDTO.getTypeEquipement().getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom est déjà utilisé.");
        }

        AttributEquipements attr = new AttributEquipements();

        attr.setNom(attrDTO.getNom());
        attr.setObligatoire(attrDTO.getObligatoire());
        attr.setActif(attrDTO.getActif());
        // Convertir la chaîne en Enum si non null
        if (attrDTO.getAttributEquipementType() != null) {
            attr.setAttributEquipementType(AttributEquipementType.valueOf(attrDTO.getAttributEquipementType()));
        }

        // Récupérer le TypeEquipement depuis la base
        if (attrDTO.getTypeEquipement() != null && attrDTO.getTypeEquipement().getId() != null) {
            TypesEquipements typeEquipement = typesEquipementsRepository.findById(attrDTO.getTypeEquipement().getId())
                    .orElseThrow(() -> new RuntimeException("TypeEquipement non trouvé avec ID : " + attrDTO.getTypeEquipement().getId()));
            attr.setTypeEquipement(typeEquipement);
        }

        AttributEquipements savedAttribut = attributEquipementsService.saveAttribut(attr);

        AttributEquipementsDTO responseDTO = new AttributEquipementsDTO(savedAttribut);
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public AttributEquipementsDTO updateAttribut(@PathVariable Long id, @RequestBody AttributEquipementsDTO attrDTO) {
        return attributEquipementsService.updateAttr(id, attrDTO);
    }


}
