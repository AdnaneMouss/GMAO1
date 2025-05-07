package com.huir.GmaoApp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
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
import com.huir.GmaoApp.dto.InterventionPieceDetacheeDTO;

import com.huir.GmaoApp.dto.InterventionPreventiveDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.InterventionPieceDetacheeRepository;
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
    @Autowired

    private InterventionPieceDetacheeRepository interventionPieceDetacheeRepository;

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
    public ResponseEntity<?> createIntervention(
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "description") String description,
            @RequestParam(value = "remarques", required = false) String remarques,
            @RequestParam("maintenanceId") Long maintenanceId,
            @RequestParam("technicienId") Long technicienId,
            @RequestParam("piecesDetachees") List<Long> pieceDetacheesIds,
            @RequestParam("quantites") List<Integer> quantites) {

        // 🔍 Check if maintenance exists
        Maintenance maintenance = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        // 👷 Build the base intervention
        InterventionPreventive InterventionPreventive = new InterventionPreventive();
        InterventionPreventive.setDescription(description);
        InterventionPreventive.setRemarques(remarques);
        InterventionPreventive.setType(TypeIntervention.PREVENTIVE);

        // 🔗 Link technician and maintenance
        User technicien = new User();
        technicien.setId(technicienId);
        InterventionPreventive.setTechnicien(technicien);
        InterventionPreventive.setMaintenance(maintenance);

        try {
            // 🖼️ Handle image uploads
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
                        photo.setInterventionPreventive(InterventionPreventive);
                        photos.add(photo);
                    }
                }
            }

            // ✨ Attach photos
            InterventionPreventive.setPhotos(photos);

            // ✅ Save the intervention FIRST
            InterventionPreventive savedIntervention = InterventionPreventiceService.save(InterventionPreventive);

            // 🔄 Now fetch spare parts
            List<PieceDetachee> pieceDetachees = pieceDetacheeRepository.findAllById(pieceDetacheesIds);
            List<InterventionPieceDetachee> interventionPieces = new ArrayList<>();

            for (int i = 0; i < pieceDetachees.size(); i++) {
                PieceDetachee piece = pieceDetachees.get(i);
                Integer quantityUsed = quantites.get(i);

                // 💥 Update stock safely
                int newQuantity = piece.getQuantiteStock() - quantityUsed;
                piece.setQuantiteStock(Math.max(0, newQuantity));

                // 🔗 Build relation with SAVED intervention
                InterventionPieceDetachee interventionPiece = new InterventionPieceDetachee();
              //   interventionPiece.setInterventionPreventive(savedIntervention);
                interventionPiece.setPieceDetachee(piece);
                interventionPiece.setQuantiteUtilisee(quantityUsed);

                interventionPieces.add(interventionPiece);
            }

            // 💾 Save after all links are valid
            interventionPieceDetacheeRepository.saveAll(interventionPieces);

            // 🎁 Return DTO
            InterventionPreventiveDTO savedInterventionDTO = new InterventionPreventiveDTO(savedIntervention);
            return ResponseEntity.ok(savedInterventionDTO);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
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

