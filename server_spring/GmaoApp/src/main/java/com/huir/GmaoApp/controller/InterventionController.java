package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.dto.InterventionPieceDetacheeDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.InterventionPieceDetacheeRepository;
import com.huir.GmaoApp.repository.MaintenanceCorrectiveRepository;
import com.huir.GmaoApp.repository.MaintenanceRepository;
import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import com.huir.GmaoApp.service.InterventionService;
import com.huir.GmaoApp.service.MaintenanceCorrectiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/interventions")
public class InterventionController {

    @Autowired
    private InterventionService interventionService;

    @Autowired
    private MaintenanceCorrectiveRepository maintenanceCorrectiveRepository;
    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private PieceDetacheeRepository pieceDetacheeRepository;
    @Autowired
    private InterventionPieceDetacheeRepository interventionPieceDetacheeRepository;

    // Get all interventions
    @GetMapping
    public List<Intervention> getAllInterventions() {
        return interventionService.findAllInterventions();
    }


    @GetMapping("/technicien/{technicienId}")
    public List<InterventionDTO> getInterventionsByTechnicien(@PathVariable Long technicienId) {
        return interventionService.getInterventionsByTechnicien(technicienId);
    }

   @GetMapping("/{interventionId}/pieces-detachees")
    //@GetMapping("/{interventionId}/pieces")
    public ResponseEntity<List<InterventionPieceDetacheeDTO>> getPiecesByInterventionId(@PathVariable Long interventionId) {
        List<InterventionPieceDetachee> interventionPieces = interventionPieceDetacheeRepository.findByInterventionId(interventionId);

        List<InterventionPieceDetacheeDTO> dtos = interventionPieces.stream()
                .map(ip -> new InterventionPieceDetacheeDTO(
                        ip.getPieceDetachee().getId(),
                        ip.getPieceDetachee().getNom(),
                        ip.getPieceDetachee().getReference(),
                        ip.getQuantiteUtilisee()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
   





    @PostMapping("/create")
    public ResponseEntity<?> createIntervention(
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "description") String description,
            @RequestParam(value = "remarques", required = false) String remarques,
            @RequestParam("maintenanceId") Long maintenanceId,
            @RequestParam("technicienId") Long technicienId,
            @RequestParam("piecesDetachees") List<Long> pieceDetacheesIds,
            @RequestParam("quantites") List<Integer> quantites) {

        try {
            // Vérifie la maintenance
            MaintenanceCorrective maintenance = maintenanceCorrectiveRepository.findById(maintenanceId)
                    .orElseThrow(() -> new RuntimeException("Maintenance not found"));

            // Crée l'intervention
            Intervention intervention = new Intervention();
            intervention.setDescription(description);
            intervention.setRemarques(remarques);
            intervention.setType(TypeIntervention.CORRECTIVE);

            // Lien avec technicien
            User technicien = new User();
            technicien.setId(technicienId);
            intervention.setTechnicien(technicien);
            intervention.setMaintenanceCorrective(maintenance);

            // Gestion des fichiers (photos)
            List<PhotosIntervention> photos = new ArrayList<>();
            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path filePath = Paths.get("uploads", fileName);
                        Files.createDirectories(filePath.getParent());
                        Files.write(filePath, file.getBytes());

                        PhotosIntervention photo = new PhotosIntervention();
                        photo.setUrl(fileName);
                        photo.setIntervention(intervention); // Lien photo -> intervention
                        photos.add(photo);
                    }
                }
            }

            intervention.setPhotos(photos);

            // 💾 ENREGISTREMENT de l'intervention AVANT d'ajouter les pièces
            Intervention savedIntervention = interventionService.save(intervention);

            // 🔄 Ajout des pièces détachées
            List<PieceDetachee> pieceDetachees = pieceDetacheeRepository.findAllById(pieceDetacheesIds);
            List<InterventionPieceDetachee> interventionPieces = new ArrayList<>();

            for (int i = 0; i < pieceDetachees.size(); i++) {
                PieceDetachee piece = pieceDetachees.get(i);
                Integer quantityUsed = quantites.get(i);

                InterventionPieceDetachee interventionPiece = new InterventionPieceDetachee();
                interventionPiece.setIntervention(savedIntervention); // Maintenant elle est bien persistée
                interventionPiece.setPieceDetachee(piece);
                interventionPiece.setQuantiteUtilisee(quantityUsed);

                interventionPieces.add(interventionPiece);
            }

            // 💾 Sauvegarde des relations avec pièces détachées
            interventionPieceDetacheeRepository.saveAll(interventionPieces);

            // 🎁 Retour DTO
            InterventionDTO savedInterventionDTO = new InterventionDTO(savedIntervention);
            return ResponseEntity.ok(savedInterventionDTO);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur: " + e.getMessage());
        }
    }

/*
    @GetMapping("/{id}/pieces")
    public ResponseEntity<List<PieceDetachee>> getPiecesByIntervention(@PathVariable Long id) {
        List<PieceDetachee> pieces = interventionService.getPiecesByInterventionId(id);
        return ResponseEntity.ok(pieces);
    }
*/

    // Delete an intervention
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(@PathVariable Long id) {
        interventionService.deleteIntervention(id);
        return ResponseEntity.noContent().build();
    }
    /////
    
    @PostMapping("/createP")
    public ResponseEntity<?> createInterventionP(
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "description") String description,
            @RequestParam(value = "remarques", required = false) String remarques,
            @RequestParam("maintenanceId") Long maintenanceId,
            @RequestParam("technicienId") Long technicienId,
            @RequestParam("piecesDetachees") List<Long> pieceDetacheesIds,
            @RequestParam("quantites") List<Integer> quantites) {

        try {
            // Vérifie la maintenance
            Maintenance maintenance = maintenanceRepository.findById(maintenanceId)
                    .orElseThrow(() -> new RuntimeException("Maintenance not found"));

            // Crée l'intervention
            Intervention intervention = new Intervention();
            intervention.setDescription(description);
            intervention.setRemarques(remarques);
            intervention.setType(TypeIntervention.PREVENTIVE);

            // Lien avec technicien
            User technicien = new User();
            technicien.setId(technicienId);
            intervention.setTechnicien(technicien);
            intervention.setMaintenance(maintenance);

            // Gestion des fichiers (photos)
            List<PhotosIntervention> photos = new ArrayList<>();
            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path filePath = Paths.get("uploads", fileName);
                        Files.createDirectories(filePath.getParent());
                        Files.write(filePath, file.getBytes());

                        PhotosIntervention photo = new PhotosIntervention();
                        photo.setUrl(fileName);
                        photo.setIntervention(intervention); // Lien photo -> intervention
                        photos.add(photo);
                    }
                }
            }

            intervention.setPhotos(photos);

            // 💾 ENREGISTREMENT de l'intervention AVANT d'ajouter les pièces
            Intervention savedIntervention = interventionService.save(intervention);

            // 🔄 Ajout des pièces détachées
            List<PieceDetachee> pieceDetachees = pieceDetacheeRepository.findAllById(pieceDetacheesIds);
            List<InterventionPieceDetachee> interventionPieces = new ArrayList<>();

            for (int i = 0; i < pieceDetachees.size(); i++) {
                PieceDetachee piece = pieceDetachees.get(i);
                Integer quantityUsed = quantites.get(i);

                InterventionPieceDetachee interventionPiece = new InterventionPieceDetachee();
                interventionPiece.setIntervention(savedIntervention); // Maintenant elle est bien persistée
                interventionPiece.setPieceDetachee(piece);
                interventionPiece.setQuantiteUtilisee(quantityUsed);

                interventionPieces.add(interventionPiece);
            }

            // 💾 Sauvegarde des relations avec pièces détachées
            interventionPieceDetacheeRepository.saveAll(interventionPieces);

            // 🎁 Retour DTO
            InterventionDTO savedInterventionDTO = new InterventionDTO(savedIntervention);
            return ResponseEntity.ok(savedInterventionDTO);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur: " + e.getMessage());
        }
    }

}
