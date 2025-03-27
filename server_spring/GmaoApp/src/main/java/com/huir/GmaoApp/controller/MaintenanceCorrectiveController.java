package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.dto.MaintenanceCorrectiveDTO;
import com.huir.GmaoApp.dto.ServiceDTO;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.service.MaintenanceCorrectiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/maintenance-corrective")
@CrossOrigin(origins = "http://localhost:4200")
public class MaintenanceCorrectiveController {

@Autowired
private MaintenanceCorrectiveService maintenanceCorrectiveService;

    @GetMapping
    public List<MaintenanceCorrectiveDTO> getAllServices() {
        return maintenanceCorrectiveService.getAllMaintenances().stream()
                .map(MaintenanceCorrectiveDTO::new)
                .collect(Collectors.toList());
    }


    @PutMapping("/{id}/start")
    public ResponseEntity<MaintenanceCorrective> startTask(@PathVariable Long id) {
        MaintenanceCorrective updatedMaintenance = maintenanceCorrectiveService.startTask(id);
        if (updatedMaintenance != null) {
            return ResponseEntity.ok(updatedMaintenance);
        } else {
            return ResponseEntity.status(400).body(null); // Si la maintenance n'est pas trouvée ou ne peut être commencée
        }
    }

    // Endpoint pour marquer une tâche comme terminée
    @PutMapping("/{id}/complete")
    public ResponseEntity<MaintenanceCorrective> markAsCompleted(@PathVariable Long id) {
        MaintenanceCorrective updatedMaintenance = maintenanceCorrectiveService.markAsCompleted(id);
        if (updatedMaintenance != null) {
            return ResponseEntity.ok(updatedMaintenance);
        } else {
            return ResponseEntity.status(400).body(null); // Si la maintenance n'est pas trouvée ou ne peut être terminée
        }
    }


    @GetMapping("/{technicienId}")
    public List<MaintenanceCorrectiveDTO> getInterventionsByTechnicien(@PathVariable Long technicienId) {
        return maintenanceCorrectiveService.getMaintenancesByTechnicien(technicienId);
    }

    @PostMapping("/add")
    public ResponseEntity<MaintenanceCorrectiveDTO> addMaintenance(@RequestBody MaintenanceCorrectiveDTO dto) {
        MaintenanceCorrectiveDTO createdDto = maintenanceCorrectiveService.createMaintenanceCorrective(dto);
        return ResponseEntity.ok(createdDto);
    }


}
