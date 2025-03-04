package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.*;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.TypesEquipements;
import com.huir.GmaoApp.service.TypesEquipementsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/types-equipements")
@CrossOrigin(origins = "http://localhost:4200")
public class TypesEquipementsController {

    @Autowired
    private TypesEquipementsService typesEquipementsService;

    @GetMapping
    public List<TypesEquipementsDTO> getAllEquipements() {
        return typesEquipementsService.getAllTypesEquipements().stream()
                .map(TypesEquipementsDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{typeId}/attributes")
    public List<AttributEquipementsDTO> getAttributesByTypeId(@PathVariable("typeId") Long typeId) {
        return typesEquipementsService.getAttributesByTypeId(typeId).stream()
                .map(AttributEquipementsDTO::new)  // Assuming you have a PieceDetacheeDTO constructor that accepts a PieceDetachee
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createType(@RequestBody TypesEquipementsDTO typesEquipementsDTO) {
        if (typesEquipementsService.existsByType(typesEquipementsDTO.getType())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom est déjà utilisé.");
        }
        TypesEquipements type = new TypesEquipements();
        type.setType(typesEquipementsDTO.getType());
        type.setImage(typesEquipementsDTO.getImage());
        TypesEquipements savedType = typesEquipementsService.saveType(type);
        return ResponseEntity.ok(new TypesEquipementsDTO(savedType));
    }
}
