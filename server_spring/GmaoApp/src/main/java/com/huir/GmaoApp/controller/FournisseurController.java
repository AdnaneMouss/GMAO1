package com.huir.GmaoApp.controller;


import java.io.IOException;
import java.util.Arrays;

import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.huir.GmaoApp.dto.ContratDTO;
import com.huir.GmaoApp.dto.FournisseurDTO;
import com.huir.GmaoApp.model.Fournisseur;
import com.huir.GmaoApp.model.Type;
import com.huir.GmaoApp.repository.FournisseurRepository;
import com.huir.GmaoApp.service.FournisseurService;

import jakarta.transaction.Transactional;


@RestController
@RequestMapping("/api/fournisseurs")
public class FournisseurController {
    @Autowired
    private FournisseurService fournisseurService;
    @Autowired
    private FournisseurRepository fournisseurRepository;

  
    @GetMapping
    @Transactional
    public List<FournisseurDTO> getAllFournisseurs() {
        return fournisseurRepository.findAll()
            .stream()
            .map(FournisseurDTO::new)
            .collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<FournisseurDTO> getFournisseurById(@PathVariable Long id) {
        FournisseurDTO dto = fournisseurService.getFournisseurDtoById(id);
        return ResponseEntity.ok(dto);
    }

    
    

    @GetMapping("/{id}/contrats")
    public List<ContratDTO> getContratsByFournisseur(@PathVariable Long id) {
        Fournisseur f = fournisseurService.getFournisseurById(id);
        return f.getContrats().stream()
                .map(ContratDTO::new)
                .collect(Collectors.toList());
    }

   

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        fournisseurService.deleteFournisseur(id);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createFournisseurWithImage(@RequestParam(value = "file", required = false) MultipartFile file,
                                                        @RequestParam("nom") String nom,
                                                        @RequestParam("codepostal") String codepostal,
                                                        @RequestParam("adresse") String adresse,
                                                        @RequestParam("email") String email,
                                                        @RequestParam("type") String type,
                                                        @RequestParam("telephone") String telephone) {
     
      

        Fournisseur fournisseur = new Fournisseur();
        fournisseur.setNom(nom);
        fournisseur.setCodepostal(codepostal);
        fournisseur.setAdresse(adresse);
        fournisseur.setEmail(email);
        try {
            fournisseur.setType(Type.valueOf(type.toLowerCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Type de fournisseur invalide : " + type);
        }

        fournisseur.setTelephone(telephone);

        try {
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads/fournisseurs", fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());

                fournisseur.setImage(fileName);  // ou setImageUrl selon ton attribut
            }

            Fournisseur saved = fournisseurService.addFournisseur(fournisseur);

            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateFournisseurWithImage(@PathVariable Long id,
                                                        @RequestParam(value = "file", required = false) MultipartFile file,
                                                        @RequestParam("nom") String nom,
                                                        @RequestParam("codepostal") String codepostal,
                                                        @RequestParam("adresse") String adresse,
                                                        @RequestParam("type") String type,
                                                        @RequestParam("email") String email,
                                                        @RequestParam("telephone") String telephone) {
        try {
            Optional<Fournisseur> existingOpt = fournisseurService.getFournisseursById(id);

            if (existingOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Fournisseur non trouvé avec l'ID : " + id));
            }

            Fournisseur fournisseur = existingOpt.get();
            fournisseur.setNom(nom);
            fournisseur.setCodepostal(codepostal);
            fournisseur.setAdresse(adresse);
            fournisseur.setEmail(email);
            fournisseur.setTelephone(telephone);

            // Conversion String -> Enum Type
            try {
                Type typeEnum = Arrays.stream(Type.values())
                    .filter(t -> t.name().equalsIgnoreCase(type))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Type invalide"));

                fournisseur.setType(typeEnum);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Type de fournisseur invalide : " + type);
            }

            // Gestion image si uploadé
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path uploadDir = Paths.get("uploads", "fournisseurs");
                Files.createDirectories(uploadDir);

                Path filePath = uploadDir.resolve(fileName);
                Files.write(filePath, file.getBytes());

                fournisseur.setImage(fileName);
            }

            Fournisseur updated = fournisseurService.updateFournisseur(fournisseur);
            return ResponseEntity.ok(updated);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la mise à jour de l'image", "details", e.getMessage()));
        }
    }

    private FournisseurDTO convertToDTO(Fournisseur fournisseur) {
        FournisseurDTO dto = new FournisseurDTO(fournisseur);
        dto.setId(fournisseur.getId());
        dto.setNom(fournisseur.getNom());
        dto.setAdresse(fournisseur.getAdresse());
        dto.setEmail(fournisseur.getEmail());
        dto.setTelephone(fournisseur.getTelephone());
        dto.setType(fournisseur.getType());
        dto.setContrats(
            fournisseur.getContrats().stream().map(contrat -> {
                ContratDTO contratDTO = new ContratDTO(contrat);
                contratDTO.setId(contrat.getId());
                contratDTO.setNumeroContrat(contrat.getNumeroContrat());
                contratDTO.setDateDebut(contrat.getDateDebut());
                contratDTO.setDateFin(contrat.getDateFin());
                return contratDTO;
            }).collect(Collectors.toList())
        );
        return dto;
    }
    
   

}
