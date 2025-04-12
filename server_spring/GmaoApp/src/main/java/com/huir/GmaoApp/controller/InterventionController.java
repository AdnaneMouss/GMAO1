package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.MaintenanceCorrectiveRepository;
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

@RestController
@RequestMapping("/api/interventions")
public class InterventionController {

    @Autowired
    private InterventionService interventionService;

    @Autowired
    private MaintenanceCorrectiveRepository maintenanceCorrectiveRepository;
    @Autowired
    private PieceDetacheeRepository pieceDetacheeRepository;

    // Get all interventions
    @GetMapping
    public List<Intervention> getAllInterventions() {
        return interventionService.findAllInterventions();
    }


    @GetMapping("/technicien/{technicienId}")
    public List<InterventionDTO> getInterventionsByTechnicien(@PathVariable Long technicienId) {
        return interventionService.getInterventionsByTechnicien(technicienId);
    }


    @PostMapping("/create")
    public ResponseEntity<?> createIntervention(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "description") String description,
            @RequestParam(value = "remarques", required = false) String remarques,
            @RequestParam("maintenanceId") Long maintenanceId,
            @RequestParam("technicienId") Long technicienId,
            @RequestParam("piecesDetachees") List<Long> pieceDetacheesIds) {

        // Check if the maintenance record exists
        MaintenanceCorrective maintenance = maintenanceCorrectiveRepository.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        // Create the intervention entity
        Intervention intervention = new Intervention();
        intervention.setDescription(description);
        intervention.setRemarques(remarques);

        // Set the maintenance corrective and technician
        User technicien = new User();
        technicien.setId(technicienId); // Set technician's ID
        intervention.setTechnicien(technicien);
        intervention.setMaintenanceCorrective(maintenance);

        // Set the intervention type to CORRECTIVE
        intervention.setType(TypeIntervention.CORRECTIVE);

        try {
            // Handle image upload
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);  // Save image in the 'uploads' folder
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            // Create the photo entity and associate it with the intervention
            PhotosIntervention photo = new PhotosIntervention();
            photo.setUrl(fileName);
            photo.setIntervention(intervention);

            // Set the photos for the intervention
            intervention.setPhotos(List.of(photo));

            // Retrieve and associate the pieces détachées (spare parts)
            List<PieceDetachee> pieceDetachees = pieceDetacheeRepository.findAllById(pieceDetacheesIds);  // Assuming you have a repository for PieceDetachee
            intervention.setPiecesDetachees(pieceDetachees);  // Set the pieces détachées to the intervention

            for (PieceDetachee piece : pieceDetachees) {
                int newQuantity = piece.getQuantiteStock() - 1;
                piece.setQuantiteStock(Math.max(0, newQuantity)); // To avoid negative quantities
            }

// Save the updated pieces if needed
            pieceDetacheeRepository.saveAll(pieceDetachees);
            // Save the intervention entity
            Intervention savedIntervention = interventionService.save(intervention);

            // Convert the saved intervention entity to DTO
            InterventionDTO savedInterventionDTO = new InterventionDTO(savedIntervention);

            return ResponseEntity.ok(savedInterventionDTO);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }

    @GetMapping("/{id}/pieces")
    public ResponseEntity<List<PieceDetachee>> getPiecesByIntervention(@PathVariable Long id) {
        List<PieceDetachee> pieces = interventionService.getPiecesByInterventionId(id);
        return ResponseEntity.ok(pieces);
    }


    // Delete an intervention
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(@PathVariable Long id) {
        interventionService.deleteIntervention(id);
        return ResponseEntity.noContent().build();
    }
}
