package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.IndiceDTO;
import com.huir.GmaoApp.service.IndiceService;
import com.huir.GmaoApp.model.Indice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200") // Permet à Angular d'accéder à l'API
@RestController
@RequestMapping("/api/indices")
public class IndiceController {

    @Autowired
    private IndiceService indiceService;

    // Récupérer tous les indices
    @GetMapping
    public List<Indice> getAllIndices() {
        return indiceService.findAllIndices();
    }

    // Récupérer un indice par ID
    @GetMapping("/{id}")
    public ResponseEntity<Indice> getIndiceById(@PathVariable Long id) {
        Optional<Indice> indice = indiceService.findIndiceById(id);
        return indice.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Ajouter un indice
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addIndice(@RequestBody IndiceDTO indiceDTO) {
        try {
            indiceService.addIndice(indiceDTO);
            return ResponseEntity.ok(Map.of("message", "Indice added successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error adding indice."));
        }
    }
    
    

    // Mettre à jour un indice
    @PutMapping("/{id}")
    public ResponseEntity<IndiceDTO> updateIndice(@PathVariable Long id, @RequestBody IndiceDTO indiceDTO) {
        return ResponseEntity.ok(indiceService.updateIndice(id, indiceDTO));
    }

    // Supprimer un indice
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIndice(@PathVariable Long id) {
        indiceService.deleteIndice(id);
        return ResponseEntity.noContent().build();
    }

}
