package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.model.Rapport;
import com.huir.GmaoApp.service.RapportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
public class RapportController {

    @Autowired
    private RapportService rapportService;

    // Get all reports
    @GetMapping
    public List<Rapport> getAllRapports() {
        return rapportService.findAllRapports();
    }

    // Create or update a report
    @PostMapping
    public ResponseEntity<Rapport> createRapport(@RequestBody Rapport rapport) {
        Rapport savedRapport = rapportService.saveRapport(rapport);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRapport);
    }

    // Delete a report
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRapport(@PathVariable Long id) {
        rapportService.deleteRapport(id);
        return ResponseEntity.noContent().build();
    }
}
