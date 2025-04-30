package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.model.AchatPiece;
import com.huir.GmaoApp.service.AchatPieceService;
import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/achats")
@RequiredArgsConstructor
public class AchatPieceController {

    private final AchatPieceService achatPieceService;

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
}
