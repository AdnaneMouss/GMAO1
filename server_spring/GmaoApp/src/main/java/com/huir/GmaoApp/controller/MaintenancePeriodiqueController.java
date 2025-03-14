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


import com.huir.GmaoApp.dto.MaintenancePeriodiqueDTO;
import com.huir.GmaoApp.dto.PieceDetacheeDTO;
import com.huir.GmaoApp.model.MaintenancePeriodique;
import com.huir.GmaoApp.service.MaintenancePeriodiqueService;


@CrossOrigin(origins = "http://localhost:4200") // Permet à Angular d'accéder à l'API
@RestController
@RequestMapping("/api/maintenancePeriodique")
public class MaintenancePeriodiqueController {
	 @Autowired
	    private MaintenancePeriodiqueService maintenancePeriodiqueService;
	 // Récupérer toutes les maintenances  Periodique 
	    @GetMapping
	    public List<MaintenancePeriodique> getAllMaintenancePeriodiques() {
	        return maintenancePeriodiqueService.findAllMaintenancesPeriodique();
	    }
	    
	    // Get  by ID
	    @GetMapping("/{id}")
	    public ResponseEntity<MaintenancePeriodique> getByMaintenancePeriodiqueId(@PathVariable Long id) {
	        Optional<MaintenancePeriodique> maintenancePeriodique = maintenancePeriodiqueService.findMaintenancePeriodiqueById(id);
	        return maintenancePeriodique.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	    }
	    @PostMapping("/add")
	    public ResponseEntity<Map<String, String>> addMaintenancePeriodique(@RequestBody MaintenancePeriodiqueDTO maintenancePeriodiqueDTO) {
	        try {
	        	maintenancePeriodiqueService.addMaintenance(maintenancePeriodiqueDTO);
	            return ResponseEntity.ok(Map.of("message", "maintenance peridique added successfully."));
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().body(Map.of("error", "Error adding ."));
	        }
	    }
	    @PutMapping("/{id}")
	    public MaintenancePeriodiqueDTO updateMaintenancePeriodique(@PathVariable Long id, @RequestBody MaintenancePeriodiqueDTO maintenancePeriodiqueDTO) {
	        return maintenancePeriodiqueService.updateMaintenancePeriodique(id, maintenancePeriodiqueDTO);
	        		
	    }
	    // Supprimer une maintenance
	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteMaintenancePeriodique(@PathVariable Long id) {
	    	maintenancePeriodiqueService.deleteMaintenancePeriodique(id);
	        return ResponseEntity.noContent().build();
	        
	        
	    }
	
}