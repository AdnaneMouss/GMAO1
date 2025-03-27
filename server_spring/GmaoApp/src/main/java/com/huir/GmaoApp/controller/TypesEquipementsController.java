package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.*;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.TypesEquipements;
import com.huir.GmaoApp.repository.TypesEquipementsRepository;
import com.huir.GmaoApp.service.TypesEquipementsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/types-equipements")
@CrossOrigin(origins = "http://localhost:4200")
public class TypesEquipementsController {

    @Autowired
    private TypesEquipementsService typesEquipementsService;
    @Autowired
    private TypesEquipementsRepository typesEquipementsRepository;

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
    public ResponseEntity<?> createType(@RequestParam(value = "file", required = false) MultipartFile file,
                                        @RequestParam("type") String type) {
        if (typesEquipementsService.existsByType(type)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom est déjà utilisé.");
        }

        TypesEquipements typeEquipement = new TypesEquipements();
        typeEquipement.setType(type);

        try {
            // Handle image upload if file is present
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads", fileName); // Save to 'uploads' directory
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());

                // Set the image URL
                typeEquipement.setImage(fileName);
            }

            // Save typeEquipement in the database
            TypesEquipements savedType = typesEquipementsService.saveType(typeEquipement);

            return ResponseEntity.ok(new TypesEquipementsDTO(savedType));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateType(
            @PathVariable Long id,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam("type") String type) {

        Optional<TypesEquipements> existingUserOpt = typesEquipementsRepository.findById(id);
        if (!existingUserOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        TypesEquipements existingType = existingUserOpt.get();
        if (type != null && !existingType.getType().equals(type)) {
            Optional<TypesEquipements> serviceExists = typesEquipementsRepository.findByType(type);
            if (serviceExists.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("field", "type", "message", "Ce nom de type d'équipement est déjà utilisé."));
            }
        }

        TypesEquipementsDTO typesEquipementsDTO = new TypesEquipementsDTO();
        typesEquipementsDTO.setType(type);


        TypesEquipementsDTO updatedType = typesEquipementsService.updateType(id, imageFile, typesEquipementsDTO);
        return updatedType != null ? ResponseEntity.ok(updatedType) : ResponseEntity.notFound().build();
    }


}
