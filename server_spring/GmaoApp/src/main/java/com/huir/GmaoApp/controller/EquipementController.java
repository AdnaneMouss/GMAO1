package com.huir.GmaoApp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.PieceDetacheeDTO;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.service.EquipementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/equipements")
@CrossOrigin(origins = "http://localhost:4200")
public class EquipementController {

    @Autowired
    private  final EquipementService equipementService;
    @Autowired
    private  EquipementRepository equipementRepository;
    // Get all equipment

    public EquipementController(EquipementService equipementService) {
        this.equipementService = equipementService;
    }

    @GetMapping("/bySalle/{salleId}")
    public List<Equipement> getEquipementsBySalle(@PathVariable Long salleId) {
        return equipementService.getEquipementsBySalle(salleId);
    }

    @GetMapping
    public List<EquipementDTO> getAllEquipements() {
        return equipementService.findAllEquipements().stream()
                .map(EquipementDTO::new)
                .collect(Collectors.toList());
    }


    @GetMapping("/service/{serviceId}")
    public List<Equipement> getEquipementsByService(@PathVariable Long serviceId) {
        return equipementService.getEquipementsByService(serviceId);
    }



    @PostMapping("/create")
    public ResponseEntity<?> createEquipement(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("nom") String nom,
            @RequestParam("description") String description,
            @RequestParam("numeroSerie") String numeroSerie,
            @RequestParam("modele") String modele,
            @RequestParam("marque") String marque,
            @RequestParam("dateAchat") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAchat,
            @RequestParam("garantie") String garantie,
            @RequestParam("coutAchat") Double coutAchat,
            @RequestParam("typeEquipementNom") String typeEquipementNom,
            @RequestParam(value = "serviceNom", required = false) String serviceNom,
            @RequestParam(value = "batimentNom", required = false) String batimentNom,
            @RequestParam(value = "etageNum", required = false) Integer etageNum,
            @RequestParam(value = "salleNum", required = false) Integer salleNum,
            @RequestParam(value = "attributsValeurs", required = false) String attributsValeursJson
    ) {

        // Check unique numeroSerie
        if (equipementService.existsByNumeroSerie(numeroSerie)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "numeroSerie", "message", "Ce numéro de série est déjà utilisé."));
        }

        // Create equipement entity
        Equipement equipement = new Equipement();
        equipement.setNom(nom);
        equipement.setDescription(description);
        equipement.setNumeroSerie(numeroSerie);
        equipement.setModele(modele);
        equipement.setMarque(marque);
        equipement.setDateAchat(dateAchat);
        equipement.setGarantie(garantie);
        equipement.setCoutAchat(coutAchat);

        // Handle image upload
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads", fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());
                equipement.setImage(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
            }
        }

        Map<Long, String> attributsValeurs = new HashMap<>();
        if (attributsValeursJson != null && !attributsValeursJson.isEmpty()) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                attributsValeurs = mapper.readValue(attributsValeursJson, new TypeReference<Map<Long, String>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body("Invalid format for attributsValeurs JSON");
            }
        }

        Equipement savedEquipement = equipementService.saveEquipementDetails(
                equipement,
                typeEquipementNom,
                serviceNom,
                batimentNom,
                etageNum,
                salleNum,
                attributsValeurs
        );

        return ResponseEntity.ok(savedEquipement);
    }


    @GetMapping("/{id}")
    public Optional<EquipementDTO> getEquipementById(@PathVariable("id") Long equipementId) {
        // Fetch the Equipement data by ID
        Optional<Equipement> equipement = equipementService.findEquipementById(equipementId);

        return equipement.map(EquipementDTO::new);
    }



    // Delete equipment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipement(@PathVariable Long id) {
        equipementService.deleteEquipement(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/attributs")
    public ResponseEntity<List<AttributEquipements>> getAttributsByEquipementId(@PathVariable Long id) {
        List<AttributEquipements> attributs = equipementService.getAttributsByEquipementId(id);
        return ResponseEntity.ok(attributs);
    }
}



