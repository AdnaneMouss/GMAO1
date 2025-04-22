package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.InterventionPieceDetacheeRepository;
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


    @PostMapping("/create")
    public ResponseEntity<?> createIntervention(
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "description") String description,
            @RequestParam(value = "remarques", required = false) String remarques,
            @RequestParam("maintenanceId") Long maintenanceId,
            @RequestParam("technicienId") Long technicienId,
            @RequestParam("piecesDetachees") List<Long> pieceDetacheesIds,
            @RequestParam("quantites") List<Integer> quantites) {

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
            // Handle multiple image uploads
            List<PhotosIntervention> photos = new ArrayList<>();

            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path filePath = Paths.get("uploads", fileName); // Save image in the 'uploads' folder
                        Files.createDirectories(filePath.getParent());
                        Files.write(filePath, file.getBytes());

                        PhotosIntervention photo = new PhotosIntervention();
                        photo.setUrl(fileName);
                        photo.setIntervention(intervention);
                        photos.add(photo);
                    }
                }
            }

            // Set the photos to the intervention
            intervention.setPhotos(photos);

            // Retrieve and associate the pieces détachées (spare parts)
            List<PieceDetachee> pieceDetachees = pieceDetacheeRepository.findAllById(pieceDetacheesIds);

            // Create a list to store the association between interventions and spare parts used
            List<InterventionPieceDetachee> interventionPieces = new ArrayList<>();

            // Loop over the spare parts and quantities, and associate them with the intervention
            for (int i = 0; i < pieceDetachees.size(); i++) {
                PieceDetachee piece = pieceDetachees.get(i);
                Integer quantityUsed = quantites.get(i);

                // Decrease the stock for the used quantity
                int newQuantity = piece.getQuantiteStock() - quantityUsed;
                piece.setQuantiteStock(Math.max(0, newQuantity)); // To avoid negative quantities

                // Create and associate the InterventionPieceDetachee
                InterventionPieceDetachee interventionPiece = new InterventionPieceDetachee();
                interventionPiece.setIntervention(intervention);
                interventionPiece.setPieceDetachee(piece);
                interventionPiece.setQuantiteUtilisee(quantityUsed);

                interventionPieces.add(interventionPiece);
            }

            // Save all the pieces used during the intervention
            interventionPieceDetacheeRepository.saveAll(interventionPieces);

            // Save the intervention
            Intervention savedIntervention = interventionService.save(intervention);

            // Convert to DTO and return
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
