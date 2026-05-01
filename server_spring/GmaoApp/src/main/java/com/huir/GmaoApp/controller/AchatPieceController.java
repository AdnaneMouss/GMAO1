package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.AchatPieceDTO;
import com.huir.GmaoApp.model.AchatPiece;
import com.huir.GmaoApp.repository.AchatPiecesRepository;
import com.huir.GmaoApp.service.AchatPieceService;
import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/achats")
@RequiredArgsConstructor
public class AchatPieceController {

    private final AchatPieceService achatPieceService;
    private final AchatPiecesRepository achatPiecesRepository;

    @PostMapping
    public ResponseEntity<?> ajouterAchat(
            @RequestParam Long pieceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAchat,
            @RequestParam int quantite,
            @RequestParam double coutUnitaire
    ) {
        try {
            AchatPiece achat = achatPieceService.ajouterAchat(pieceId, dateAchat, quantite, coutUnitaire);
            return ResponseEntity.ok(achat);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> mettreAJourAchat(
            @RequestParam Long achatId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAchat,
            @RequestParam int quantite,
            @RequestParam double coutUnitaire
    ) {
        try {
            // Call the service layer to update the AchatPiece without updating the pieceId
            AchatPiece achat = achatPieceService.mettreAJourAchat(achatId, dateAchat, quantite, coutUnitaire);
            return ResponseEntity.ok(achat);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> supprimerAchat(@RequestParam Long achatId) {
        try {
            achatPieceService.supprimerAchat(achatId);
            return ResponseEntity.ok(Map.of("message", "✅ Achat supprimé avec succès !"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }




    @GetMapping("/piece/{pieceId}")
    public List<AchatPieceDTO> getAchatsByPiece(@PathVariable Long pieceId) {
        return achatPieceService.getAchatsByPieceId(pieceId);
    }
}
