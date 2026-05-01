package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.*;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.TypesEquipements;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.TypesEquipementsRepository;
import com.huir.GmaoApp.service.TypesEquipementsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/types-equipements")
@CrossOrigin(origins = "http://localhost:4200")
public class TypesEquipementsController {

    @Autowired
    private TypesEquipementsService typesEquipementsService;
    @Autowired
    private TypesEquipementsRepository typesEquipementsRepository;
    @Autowired
    private EquipementRepository equipementRepository;


    @GetMapping
    public List<TypesEquipementsDTO> getTypesEquipementsActifs() {
        return typesEquipementsService.getTypesEquipementsActifs().stream()
                .map(TypesEquipementsDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/inactifs")
    public List<TypesEquipementsDTO> getTypesEquipementsInactifs() {
        return typesEquipementsService.getTypesEquipementsInactifs().stream()
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
    public ResponseEntity<?> createType(@RequestParam(value = "file", required = false) MultipartFile file,
                                        @RequestParam("type") String type) {
        if (typesEquipementsService.existsByTypeAndActifTrue(type)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom est déjà utilisé par un type actif.");
        }

        TypesEquipements typeEquipement = new TypesEquipements();
        typeEquipement.setType(type);
        typeEquipement.setActif(true);

        try {
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads", fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());
                typeEquipement.setImage(fileName);
            }

            TypesEquipements savedType = typesEquipementsService.saveType(typeEquipement);
            return ResponseEntity.ok(new TypesEquipementsDTO(savedType));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Échec de l'upload de l'image");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateType(
            @PathVariable Long id,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam("type") String type) {

        Optional<TypesEquipements> existingUserOpt = typesEquipementsRepository.findById(id);
        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        TypesEquipements existingType = existingUserOpt.get();
        if (type != null && !existingType.getType().equals(type)) {
            Optional<TypesEquipements> duplicateType = typesEquipementsRepository
                    .findByTypeAndActifTrue(type);

            // Make sure it's not the same type by ID
            if (duplicateType.isPresent() && !duplicateType.get().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "type", "message", "Ce nom de type d'équipement est déjà utilisé par un autre type actif."));
            }
        }

        TypesEquipementsDTO typesEquipementsDTO = new TypesEquipementsDTO(existingType);
        typesEquipementsDTO.setType(type);

        TypesEquipementsDTO updatedType = typesEquipementsService.updateType(id, imageFile, typesEquipementsDTO);
        return updatedType != null ? ResponseEntity.ok(updatedType) : ResponseEntity.notFound().build();
    }


    //Corbeille


    @PutMapping("/{id}/archiver")
    public ResponseEntity<Map<String, String>> archiver(@PathVariable Long id) {
        TypesEquipements type = typesEquipementsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type non trouvé"));

        boolean hasLinkedEquipements = equipementRepository.existsByTypeEquipement(type);
        if (hasLinkedEquipements) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible d’archiver : ce type est lié à au moins un équipement.");
        }

        type.setActif(false);
        typesEquipementsRepository.save(type);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Type d’équipement archivé avec succès");

        return ResponseEntity.ok(response);
    }

    @PutMapping("/archiver-multiple")
    public ResponseEntity<?> archiverMultipleTypes(@RequestBody List<Long> ids) {
        List<TypesEquipements> typesToArchive = typesEquipementsRepository.findAllById(ids);

        if (typesToArchive.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucun type trouvé pour les IDs donnés.");
        }

        List<String> linkedTypes = new ArrayList<>();

        for (TypesEquipements type : typesToArchive) {
            boolean isLinked = equipementRepository.existsByTypeEquipement(type);
            if (isLinked) {
                linkedTypes.add("Type '" + type.getType() + "' est lié à des équipements");
            }
        }

        if (!linkedTypes.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Archivage impossible :\n" + String.join("\n", linkedTypes)
            );
        }

        // Archivage en masse maintenant que tout est clean
        for (TypesEquipements type : typesToArchive) {
            type.setActif(false);
            typesEquipementsRepository.save(type);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tous les types ont été archivés avec succès.");
        response.put("archivés", typesToArchive.stream().map(TypesEquipements::getType).toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/restaurer")
    public ResponseEntity<Map<String, String>> restaurer(@PathVariable Long id) {
        TypesEquipements type = typesEquipementsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type non trouvé"));

        // Check if another actif type exists with same name
        Optional<TypesEquipements> existingActif = typesEquipementsRepository.findByTypeAndActifTrue(type.getType());
        if (existingActif.isPresent() && !existingActif.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Un type actif avec ce nom existe déjà. Restauration impossible."));
        }

        type.setActif(true);
        typesEquipementsRepository.save(type);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Type d’équipement restauré avec succès");

        return ResponseEntity.ok(response);
    }

    @PutMapping("/restaurer-multiple")
    public ResponseEntity<?> restaurerMultipleTypes(@RequestBody List<Long> ids) {
        try {
            typesEquipementsService.restaurerMultiple(ids);
            return ResponseEntity.ok("Types restaurés avec succès !");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la restauration.");
        }
    }


}
