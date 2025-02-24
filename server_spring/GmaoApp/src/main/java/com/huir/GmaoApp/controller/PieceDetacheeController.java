package com.huir.GmaoApp.controller;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.PieceDetacheeDTO;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.service.PieceDetacheeService;

@RestController
@RequestMapping("/api/pieces-detachees")
@CrossOrigin(origins = "http://localhost:4200")
public class PieceDetacheeController {

    @Autowired
    private PieceDetacheeService pieceDetacheeService;

    @GetMapping
    public List<PieceDetacheeDTO> getAllEquipements() {
        return pieceDetacheeService.findAllPiecesDetachees().stream()
                .map(PieceDetacheeDTO::new)
                .collect(Collectors.toList());
    }
    // Get spare part by ID
    @GetMapping("/{id}")
    public ResponseEntity<PieceDetachee> getPieceDetacheeById(@PathVariable Long id) {
        Optional<PieceDetachee> pieceDetachee = pieceDetacheeService.FindPieceById(id);
        return pieceDetachee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    
    
     @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addPiece(@RequestBody PieceDetacheeDTO pieceDTO) {
        try {
            pieceDetacheeService.addPiece(pieceDTO);
            return ResponseEntity.ok(Map.of("message", "piece added successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error adding piece."));
        }
    }
    
    @PutMapping("/{id}")
    public PieceDetacheeDTO updatePiece(@PathVariable Long id, @RequestBody PieceDetacheeDTO pieceDTO) {
        return pieceDetacheeService.updatePiece(id, pieceDTO);
    }
    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePiece(@PathVariable Long id) {
    	pieceDetacheeService.deletePieceDetachee(id);
        return ResponseEntity.noContent().build();
    }
}
