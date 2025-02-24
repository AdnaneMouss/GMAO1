package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.model.CoutMaintenance;
import com.huir.GmaoApp.service.CoutMaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/couts-maintenance")
public class CoutMaintenanceController {

    @Autowired
    private CoutMaintenanceService coutMaintenanceService;

    // Get all maintenance costs
    @GetMapping
    public List<CoutMaintenance> getAllCoutsMaintenance() {
        return coutMaintenanceService.findAllCoutMaintenance();
    }

    // Create or update a maintenance cost
    @PostMapping
    public ResponseEntity<CoutMaintenance> createCoutMaintenance(@RequestBody CoutMaintenance coutMaintenance) {
        CoutMaintenance savedCoutMaintenance = coutMaintenanceService.saveCoutMaintenance(coutMaintenance);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCoutMaintenance);
    }

    // Delete a maintenance cost
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoutMaintenance(@PathVariable Long id) {
        coutMaintenanceService.deleteCoutMaintenance(id);
        return ResponseEntity.noContent().build();
    }
}
