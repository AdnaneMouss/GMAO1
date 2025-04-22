package com.huir.GmaoApp.controller;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.PieceDetacheeDTO;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.service.PieceDetacheeService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pieces-detachees")
@CrossOrigin(origins = "http://localhost:4200")
public class PieceDetacheeController {

    @Autowired
    private PieceDetacheeService pieceDetacheeService;

    @Autowired
    private PieceDetacheeRepository pieceDetacheeRepository;

    @GetMapping
    public List<PieceDetacheeDTO> getAllPieces() {
        return pieceDetacheeService.findAllPiecesDetachees().stream()
                .map(PieceDetacheeDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PieceDetachee> getPieceDetacheeById(@PathVariable Long id) {
        try {
            PieceDetachee pieceDetachee = pieceDetacheeService.findPieceDetacheeById(id);
            return ResponseEntity.ok(pieceDetachee);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }



    @PostMapping
    public ResponseEntity<?> createPieceWithImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("nom") String nom,
            @RequestParam("description") String description,
            @RequestParam("reference") String reference,
            @RequestParam("fournisseur") String fournisseur,
            @RequestParam("coutUnitaire") double coutUnitaire,
            @RequestParam("quantiteStock") int quantiteStock,
            @RequestParam("quantiteMinimale") int quantiteMinimale
    ) {
        if (pieceDetacheeRepository.existsByReference(reference)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Une pièce avec cette référence existe déjà.");
        }

        PieceDetachee piece = new PieceDetachee();
        piece.setNom(nom);
        piece.setDescription(description);
        piece.setReference(reference);
        piece.setFournisseur(fournisseur);
        piece.setCoutUnitaire(coutUnitaire);
        piece.setQuantiteStock(quantiteStock);
        piece.setQuantiteMinimale(quantiteMinimale);

        try {
            // Sauvegarde de l'image
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get("uploads", fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            // Associer l'image à la pièce
            piece.setImage(fileName);

            // Sauvegarde en base
            PieceDetachee savedPiece = pieceDetacheeService.addPiece(piece);
            return ResponseEntity.ok(new PieceDetacheeDTO(savedPiece));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de l'upload de l'image.");
        }
    }


    /**
     * 🔹 Mettre à jour une pièce avec ou sans image
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePiece(
            @PathVariable Long id,

            // Make all parameters optional
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "nom") String nom,
            @RequestParam(value = "description") String description,
            @RequestParam(value = "reference") String reference,
            @RequestParam(value = "fournisseur") String fournisseur,
            @RequestParam(value = "coutUnitaire") Double coutUnitaire,
            @RequestParam(value = "quantiteStock") Integer quantiteStock,
            @RequestParam(value = "quantiteMinimale") Integer quantiteMinimale,

            // Make dates optional with DateTimeFormat
            @RequestParam(value = "dateAchat") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAchat,
            @RequestParam(value = "datePeremption") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datePeremption
    ) {
        System.out.println("🔥 Reached updatePiece endpoint");
        System.out.println("💾 ID: " + id);

        Optional<PieceDetachee> existingPieceOpt = pieceDetacheeRepository.findById(id);
        if (existingPieceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PieceDetachee existingPiece = existingPieceOpt.get();

        // Update only the fields that were provided in the request
        if (nom != null) existingPiece.setNom(nom);
        if (description != null) existingPiece.setDescription(description);
        if (reference != null && !reference.equals(existingPiece.getReference())) {
            if (pieceDetacheeRepository.existsByReference(reference)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Une pièce avec cette référence existe déjà.");
            }
            existingPiece.setReference(reference);
        }
        if (fournisseur != null) existingPiece.setFournisseur(fournisseur);
        if (coutUnitaire != null) existingPiece.setCoutUnitaire(coutUnitaire);
        if (quantiteStock != null) existingPiece.setQuantiteStock(quantiteStock);
        if (quantiteMinimale != null) existingPiece.setQuantiteMinimale(quantiteMinimale);
        if (dateAchat != null) existingPiece.setDateAchat(dateAchat);
        if (datePeremption != null) existingPiece.setDatePeremption(datePeremption);

        try {
            // Handle file upload if it's provided
            if (file != null && !file.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads", fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());
                existingPiece.setImage(fileName);
            }

            // Save the updated piece
            PieceDetachee updatedPiece = pieceDetacheeService.addPiece(existingPiece);
            return ResponseEntity.ok(new PieceDetacheeDTO(updatedPiece));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la mise à jour de l'image.");
        }
    }


}
