package com.huir.GmaoApp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.dto.InterventionPreventiveDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.MaintenanceRepository;
import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import com.huir.GmaoApp.service.*;
@RestController
@RequestMapping("/api/interventionsPRE" )
public class InterventionPreventiveController {

	@Autowired
    private InterventionPreventiceService InterventionPreventiceService;

    @Autowired
    private MaintenanceRepository maintenanceRepository;
    @Autowired
    private PieceDetacheeRepository pieceDetacheeRepository;

    // Get all interventions    
    @GetMapping
    public List<InterventionPreventive> getAllInterventions() {
        return InterventionPreventiceService.getAllInterventions();
    }


    @GetMapping("/technicien/{technicienId}")
    public List<InterventionPreventiveDTO> getInterventionsByTechnicien(@PathVariable Long technicienId) {
        return InterventionPreventiceService.getInterventionsByTechnicien(technicienId);
    }


    @PostMapping("/create")
    public ResponseEntity<?> createInterventionPreventive(
            // @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "description") String description,
            @RequestParam(value = "remarques", required = false) String remarques,
            @RequestParam("maintenanceId") Long maintenanceId,
            @RequestParam("technicienId") Long technicienId,
            @RequestParam("piecesDetachees") List<Long> pieceDetacheesIds) {

        // Vérifier si l'enregistrement de maintenance existe
        Maintenance maintenance = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance non trouvée"));

        // Créer l'entité d'intervention
        InterventionPreventive interventionPreventive = new InterventionPreventive();
        interventionPreventive.setDescription(description);
        interventionPreventive.setRemarques(remarques);

        // Définir le technicien et la maintenance
        User technicien = new User();
        technicien.setId(technicienId);
        interventionPreventive.setTechnicien(technicien);
        interventionPreventive.setMaintenance(maintenance);

        // Définir le type d'intervention comme PRÉVENTIVE
        interventionPreventive.setType(TypeIntervention.PREVENTIVE);

        try {
            // Gestion de l'upload d'image (désactivée)
            /*
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            PhotosIntervention photo = new PhotosIntervention();
            photo.setUrl(fileName);
            interventionPreventive.setPhotos(List.of(photo));
            */

            // Récupérer et associer les pièces détachées
            List<PieceDetachee> pieceDetachees = pieceDetacheeRepository.findAllById(pieceDetacheesIds);
            interventionPreventive.setPiecesDetachees(pieceDetachees);

            for (PieceDetachee piece : pieceDetachees) {
                int newQuantity = piece.getQuantiteStock() - 1;
                piece.setQuantiteStock(Math.max(0, newQuantity));
            }

            pieceDetacheeRepository.saveAll(pieceDetachees);

            // Sauvegarder l'intervention
            InterventionPreventive savedIntervention = InterventionPreventiceService.save(interventionPreventive);

            // Convertir l'entité sauvegardée en DTO
            InterventionPreventiveDTO savedInterventionDTO = new InterventionPreventiveDTO(savedIntervention);

            return ResponseEntity.ok(savedInterventionDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la création de l'intervention");
        }
    }


       

          

          
    @GetMapping("/{id}/pieces")
    public ResponseEntity<List<PieceDetachee>> getPiecesByIntervention(@PathVariable Long id) {
        List<PieceDetachee> pieces = InterventionPreventiceService.getPiecesByInterventionId(id);
        return ResponseEntity.ok(pieces);
    }


    // Delete an intervention
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(@PathVariable Long id) {
    	InterventionPreventiceService.deleteIntervention(id);
        return ResponseEntity.noContent().build();
    }
}

