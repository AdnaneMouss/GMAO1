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
            // If a new image is uploaded, handle it
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    // Delete the old image (if exists)
                    if (typesEquipements.getImage() != null) {
                        File oldImage = new File("uploads/" + typesEquipements.getImage());
                        if (oldImage.exists()) {
                            oldImage.delete();
                        }
                    }

                    // Generate a unique image filename
                    String filename = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
                    Path imagePath = Paths.get("uploads/" + filename);

                    // Save the new image
                    Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

                    // Update entity with new image path
                    typesEquipements.setImage(filename);
                } catch (IOException e) {
                    throw new RuntimeException("Error while saving image", e);
                }
            }

            typesEquipementsRepository.save(typesEquipements);
            return new TypesEquipementsDTO(typesEquipements);
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
