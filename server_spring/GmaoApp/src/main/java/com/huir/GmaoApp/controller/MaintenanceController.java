package com.huir.GmaoApp.controller;


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

import com.huir.GmaoApp.dto.MaintenanceDTO;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.service.MaintenanceService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200") // Permet à Angular d'accéder à l'API
@RestController
@RequestMapping("/api/maintenances")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    // Récupérer toutes les maintenances
    @GetMapping
    public List<MaintenanceDTO> getAllMaintenances() {
        List<Maintenance> maintenances = maintenanceService.getAllMaintenances();
        return maintenances.stream()
                .map(maintenanceService::convertToDTO)
                .toList();
    }

    // Ajouter une maintenance
    @PostMapping("/add")
    public ResponseEntity<MaintenanceDTO> addMaintenance(@Valid @RequestBody MaintenanceDTO maintenanceDTO) {
        Maintenance savedMaintenance = maintenanceService.addMaintenance(maintenanceDTO);
        MaintenanceDTO dto = maintenanceService.convertToDTO(savedMaintenance);
        return ResponseEntity.ok(dto);
    }

    // Récupérer une maintenance par ID
    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDTO> getMaintenanceById(@PathVariable Long id) {
        Optional<Maintenance> maintenance = maintenanceService.getMaintenanceById1(id);
        return maintenance.map(m -> ResponseEntity.ok(maintenanceService.convertToDTO(m)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
 // modifier
    @PutMapping("/maintenances/{id}")
    public ResponseEntity<MaintenanceDTO> updateMaintenance(
        @PathVariable Long id, 
        @Valid @RequestBody MaintenanceDTO maintenanceDTO) {
        
       
        Maintenance existingMaintenance = maintenanceService.getMaintenanceById(id);
        if (existingMaintenance == null) {
            return ResponseEntity.notFound().build(); // Retourne 404 si la maintenance n'existe pas
        }
        
        existingMaintenance.setEquipement(maintenanceDTO.getEquipement());
        existingMaintenance.setDepartement(maintenanceDTO.getDepartement());
        existingMaintenance.setPersonneResponsable(maintenanceDTO.getPersonneResponsable());
        existingMaintenance.setFrequence(maintenanceDTO.getFrequence());
        existingMaintenance.setDateIntervention(maintenanceDTO.getDateIntervention());
        existingMaintenance.setDureeEstimee(maintenanceDTO.getDureeEstimee());
        existingMaintenance.setUniteDuree(maintenanceDTO.getUniteDuree());
        existingMaintenance.setPiecesRechange(maintenanceDTO.getPiecesRechange());
        existingMaintenance.setQuantitePieces(maintenanceDTO.getQuantitePieces());
        existingMaintenance.setLocalisation(maintenanceDTO.getLocalisation());
        existingMaintenance.setStatut(maintenanceDTO.getStatut());
        existingMaintenance.setImageEquipement(maintenanceDTO.getImageEquipement());

        
        Maintenance updatedMaintenance = maintenanceService.updateMaintenance(existingMaintenance);

        
        MaintenanceDTO dto = maintenanceService.convertToDTO(updatedMaintenance);
        return ResponseEntity.ok(dto); // Retourne 200 OK avec le DTO
    }


    // Supprimer une maintenance
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }
}