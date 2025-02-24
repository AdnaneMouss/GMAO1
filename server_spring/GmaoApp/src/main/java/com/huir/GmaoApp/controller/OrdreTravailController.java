package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.model.OrdreTravail;
import com.huir.GmaoApp.model.StatutOrdre;
import com.huir.GmaoApp.service.OrdreTravailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordres-travail")
public class OrdreTravailController {

    @Autowired
    private OrdreTravailService ordreTravailService;

    // Get all orders
    @GetMapping
    public List<OrdreTravail> getAllOrdresTravail() {
        return ordreTravailService.findAllOrdresTravail();
    }

    // Get orders by status
    @GetMapping("/status/{statut}")
    public List<OrdreTravail> getOrdresTravailByStatus(@PathVariable StatutOrdre statut) {
        return ordreTravailService.findOrdresTravailByStatus(statut);
    }

    // Create or update an order
    @PostMapping
    public ResponseEntity<OrdreTravail> createOrdreTravail(@RequestBody OrdreTravail ordreTravail) {
        OrdreTravail savedOrdreTravail = ordreTravailService.saveOrdreTravail(ordreTravail);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrdreTravail);
    }

    // Delete an order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrdreTravail(@PathVariable Long id) {
        ordreTravailService.deleteOrdreTravail(id);
        return ResponseEntity.noContent().build();
    }
}
