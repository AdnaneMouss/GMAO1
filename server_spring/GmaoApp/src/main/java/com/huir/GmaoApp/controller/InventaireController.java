package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.BatimentDTO;
import com.huir.GmaoApp.dto.InventaireDTO;
import com.huir.GmaoApp.model.Inventaire;
import com.huir.GmaoApp.service.InventaireService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventaires")
@RequiredArgsConstructor
public class InventaireController {

    private final InventaireService inventaireService;

    @PostMapping
    public ResponseEntity<InventaireDTO> ajouterInventaire(@RequestBody InventaireDTO dto) {
        Inventaire inventaire = inventaireService.ajouterInventaire(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new InventaireDTO(inventaire));
    }


    @GetMapping
    public List<InventaireDTO> getAllInventaires() {
        return inventaireService.getAll().stream() // Si tu veux retourner des DTO, adapte ici
                .map(InventaireDTO::new)
                .collect(Collectors.toList());

}

    @PutMapping("/{id}")
    public ResponseEntity<InventaireDTO> modifierInventaire(
            @PathVariable Long id,
            @RequestBody InventaireDTO dto) {

        Inventaire updated = inventaireService.modifierInventaire(id, dto);
        return ResponseEntity.ok(new InventaireDTO(updated));
    }

    @PutMapping("/{id}/corriger-stock")
    public ResponseEntity<Void> corrigerStock(@PathVariable Long id) {
        inventaireService.corrigerStock(id);
        return ResponseEntity.ok().build(); // ✅ Explicit empty 200 response
    }



}
