package com.huir.GmaoApp.controller;


import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import java.nio.file.Files;
import java.util.stream.Collectors;


import com.huir.GmaoApp.dto.ServiceDTO;
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
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/fournisseurs")
public class FournisseurController {
    @Autowired
    private FournisseurService fournisseurService;
    @Autowired
    private FournisseurRepository fournisseurRepository;

  
    @GetMapping
    public List<FournisseurDTO> getServicesActifs() {
        return fournisseurService.getFournisseursActifs().stream()
                .map(FournisseurDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/inactifs")
    public List<FournisseurDTO> getServicesInactifs() {
        return fournisseurService.getFournisseursInactifs().stream()
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
    public ResponseEntity<?> createFournisseurWithImage(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("nom") String nom,
            @RequestParam("codepostal") String codepostal,
            @RequestParam("adresse") String adresse,
            @RequestParam("email") String email,
            @RequestParam("type") String typeString,
            @RequestParam("telephone") String telephone
    ) {
        // Uniqueness checks
        if (fournisseurService.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "email", "message", "Cet email est déjà utilisé par un autre fournisseur."));
        }

        if (fournisseurService.existsByTelephone(telephone)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "telephone", "message", "Ce numéro de téléphone est déjà utilisé."));
        }

        // You can also add this if "nom" must be unique
         if (fournisseurService.existsByNom(nom)) {
             return ResponseEntity.status(HttpStatus.CONFLICT)
                     .body(Map.of("field", "nom", "message", "Ce nom est déjà utilisé."));
         }

        Fournisseur fournisseur = new Fournisseur();
        fournisseur.setNom(nom);
        fournisseur.setCodepostal(codepostal);
        fournisseur.setAdresse(adresse);
        fournisseur.setEmail(email);
        fournisseur.setTelephone(telephone);
        fournisseur.setDateajout(LocalDateTime.now());

        try {
            // Validate and set enum type
            Type type = Type.valueOf(typeString.toUpperCase());
            fournisseur.setType(type);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Type de fournisseur invalide : " + typeString);
        }

        try {
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads", fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());

                fournisseur.setImage(fileName); // or setImageUrl if needed
            }

            Fournisseur saved = fournisseurService.addFournisseur(fournisseur);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Échec de l'enregistrement de l'image.");
        }
    }


    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateFournisseurWithImage(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("nom") String nom,
            @RequestParam("codepostal") String codepostal,
            @RequestParam("adresse") String adresse,
            @RequestParam("type") String type,
            @RequestParam("email") String email,
            @RequestParam("telephone") String telephone
    ) {

        Optional<Fournisseur> existingOpt = fournisseurService.getFournisseursById(id);

        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Fournisseur non trouvé avec l'ID : " + id));
        }

        Fournisseur existing = existingOpt.get();

        // uniqueness checks
        if (!email.equalsIgnoreCase(existing.getEmail()) &&
                fournisseurService.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "email", "message", "Cet email est déjà utilisé."));
        }

        if (!telephone.equals(existing.getTelephone()) &&
                fournisseurService.existsByTelephone(telephone)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "telephone", "message", "Ce numéro est déjà utilisé."));
        }

        if (!nom.equalsIgnoreCase(existing.getNom()) &&
                fournisseurService.existsByNom(nom)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "nom", "message", "Ce nom est déjà utilisé."));
        }

        try {
            Fournisseur updated = fournisseurService.updateFournisseur(
                    id, file, nom, codepostal, adresse, type, email, telephone
            );

            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
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


    @PutMapping("/{id}/archiver")
    public ResponseEntity<Map<String, String>> archiverFournisseur(@PathVariable Long id) {
        Fournisseur fournisseur = fournisseurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fournisseur non trouvé"));

        fournisseur.setActif(false);
        fournisseurRepository.save(fournisseur);

        return ResponseEntity.ok(Map.of("message", "Fournisseur archivé avec succès"));
    }

    @PutMapping("/archiver-multiple")
    public ResponseEntity<?> archiverFournisseurs(@RequestBody List<Long> ids) {
        List<Fournisseur> fournisseurs = fournisseurRepository.findAllById(ids);

        if (fournisseurs.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucun fournisseur trouvé pour les IDs donnés.");
        }

        fournisseurs.forEach(f -> f.setActif(false));
        fournisseurRepository.saveAll(fournisseurs);

        return ResponseEntity.ok(Map.of(
                "message", "Fournisseurs archivés avec succès",
                "archivés", fournisseurs.stream().map(Fournisseur::getNom).toList()
        ));
    }

    @PutMapping("/{id}/restaurer")
    public ResponseEntity<?> restaurerFournisseur(@PathVariable Long id) {
        Fournisseur fournisseur = fournisseurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fournisseur non trouvé"));

// Email déjà utilisé
        if (fournisseurRepository.existsByEmailAndActifTrue(fournisseur.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "field", "email",
                            "message", "Un fournisseur actif avec cet email existe déjà."
                    ));
        }

// Nom déjà utilisé
        if (fournisseurRepository.existsByNomAndActifTrue(fournisseur.getNom())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "field", "nom",
                            "message", "Un fournisseur actif avec ce nom existe déjà."
                    ));
        }

// Téléphone déjà utilisé
        if (fournisseurRepository.existsByTelephoneAndActifTrue(fournisseur.getTelephone())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "field", "telephone",
                            "message", "Un fournisseur actif avec ce téléphone existe déjà."
                    ));
        }

        fournisseur.setActif(true);
        fournisseurRepository.save(fournisseur);

        return ResponseEntity.ok(Map.of("message", "Fournisseur restauré avec succès"));
    }


    @PutMapping("/restaurer-multiple")
    public ResponseEntity<?> restaurerFournisseurs(@RequestBody List<Long> ids) {
        List<Fournisseur> fournisseurs = fournisseurRepository.findAllById(ids);
        List<String> conflits = new ArrayList<>();

        for (Fournisseur fournisseur : fournisseurs) {
            if (fournisseurRepository.existsByEmailAndActifTrue(fournisseur.getEmail())) {
                conflits.add("Email déjà utilisé : " + fournisseur.getEmail());
                continue;
            }

            fournisseur.setActif(true);
        }

        if (!conflits.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(conflits);
        }

        fournisseurRepository.saveAll(fournisseurs);

        return ResponseEntity.ok(Map.of("message", "Fournisseurs restaurés avec succès"));
    }



}
