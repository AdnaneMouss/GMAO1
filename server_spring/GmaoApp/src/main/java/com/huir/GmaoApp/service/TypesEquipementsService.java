package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.ServiceDTO;
import com.huir.GmaoApp.dto.TypesEquipementsDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.TypesEquipementsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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


    @Transactional
    public TypesEquipementsDTO updateType(Long id, MultipartFile imageFile, TypesEquipementsDTO typesEquipementsDTO) {
        Optional<TypesEquipements> optionalTypesEquipements = typesEquipementsRepository.findById(id);

        if (optionalTypesEquipements.isPresent()) {
            TypesEquipements typesEquipements = optionalTypesEquipements.get();

            // Update text fields
            typesEquipements.setType(typesEquipementsDTO.getType());

            try {
                // If a new image is uploaded, handle it
                if (imageFile != null && !imageFile.isEmpty()) {

                    // Delete the old image if it exists
                    if (typesEquipements.getImage() != null) {
                        Files.deleteIfExists(Paths.get("uploads", typesEquipements.getImage()));
                    }

                    // Generate unique filename
                    String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                    Path imagePath = Paths.get("uploads", filename);

                    // Create uploads folder if missing
                    Files.createDirectories(imagePath.getParent());

                    // Save new image
                    Files.write(imagePath, imageFile.getBytes());

                    // Update entity image
                    typesEquipements.setImage(filename);
                }

                // Save updated entity
                typesEquipementsRepository.save(typesEquipements);

                return new TypesEquipementsDTO(typesEquipements);

            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de la mise à jour de l'image", e);

            } catch (Exception e) {
                throw new RuntimeException("Erreur lors de la mise à jour du type d'équipement", e);
            }

        } else {
            return null;
        }
    }


    public TypesEquipements saveType(TypesEquipements type) {
        return typesEquipementsRepository.save(type);
    }

    public boolean existsByType(String type) {
        return typesEquipementsRepository.existsByType(type);
    }
}
