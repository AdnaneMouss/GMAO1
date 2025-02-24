package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.service.PieceDetacheeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pieces-detachees")
public class PieceDetacheeController {

    @Autowired
    private PieceDetacheeService pieceDetacheeService;

    // Get all spare parts
    @GetMapping
    public List<PieceDetachee> getAllPiecesDetachees() {
        return pieceDetacheeService.findAllPiecesDetachees();
    }

    // Get spare part by ID
    @GetMapping("/{id}")
    public ResponseEntity<PieceDetachee> getPieceDetacheeById(@PathVariable Long id) {
        Optional<PieceDetachee> pieceDetachee = pieceDetacheeService.findPieceDetacheeById(id);
        return pieceDetachee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create or update spare part
    @PostMapping
    public ResponseEntity<PieceDetachee> createPieceDetachee(@RequestBody PieceDetachee pieceDetachee) {
        PieceDetachee savedPieceDetachee = pieceDetacheeService.savePieceDetachee(pieceDetachee);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPieceDetachee);
    }

    // Delete spare part
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePieceDetachee(@PathVariable Long id) {
        pieceDetacheeService.deletePieceDetachee(id);
        return ResponseEntity.noContent().build();
    }
}
