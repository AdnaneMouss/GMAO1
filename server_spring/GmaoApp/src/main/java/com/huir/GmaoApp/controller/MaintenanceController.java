package com.huir.GmaoApp.controller;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huir.GmaoApp.dto.IndicateurDTO;
import com.huir.GmaoApp.dto.MaintenanceCorrectiveDTO;
import com.huir.GmaoApp.dto.MaintenanceDTO;
import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.model.Priorite;
import com.huir.GmaoApp.model.Statut;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.AttributEquipementsValeursRepository;
import com.huir.GmaoApp.repository.IndiceRepository;
import com.huir.GmaoApp.service.MaintenanceService;

import jakarta.persistence.criteria.Path;
import jakarta.validation.Valid;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; 

@CrossOrigin(origins = "http://localhost:4200") // Permet à Angular d'accéder à l'API
@RestController
@RequestMapping("/api/maintenances")
public class MaintenanceController {
	 private static final Logger logger = LoggerFactory.getLogger(MaintenanceController.class);
	
		@Autowired
		private AttributEquipementsRepository attributEquipementsRepository;
		@Autowired
		private AttributEquipementsValeursRepository attributEquipementsValeursRepository;



		@Autowired
	    private  IndiceRepository indiceRepository;

    @Autowired
    private MaintenanceService maintenanceService;

    // Récupérer toutes les maintenances   
    @GetMapping
    public List<Maintenance> getAllMaintenances() {
        return maintenanceService.findAllMaintenances();
    }
    // Get  by ID
    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getMaintenancesById(@PathVariable Long id) {
        Optional<Maintenance> maintenance = maintenanceService.findMaintenanceById(id);
        return maintenance.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addMaintenance(@RequestBody MaintenanceDTO maintenanceDTO) {
        try {
        	
        	maintenanceService.addMaintenance(maintenanceDTO);
            return ResponseEntity.ok(Map.of("message", "maintenance added successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error adding ."));
        }
    }
  
  //ethode de  batiment 
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<Maintenance> markAsCompleted(@PathVariable Long id) {
        Maintenance updatedMaintenance = maintenanceService.markAsCompleted(id);
        if (updatedMaintenance != null) {
            return ResponseEntity.ok(updatedMaintenance);
        } else {
            return ResponseEntity.status(400).body(null); // Si la maintenance n'est pas trouvée ou ne peut être terminée
        }
    }
    
    @PutMapping("/{id}/start")
    public ResponseEntity<Maintenance> startTask(@PathVariable Long id) {
        Maintenance updatedMaintenance = maintenanceService.startTask(id);
        if (updatedMaintenance != null) {
            return ResponseEntity.ok(updatedMaintenance);
        } else {
            return ResponseEntity.status(400).body(null); // Si la maintenance n'est pas trouvée ou ne peut être commencée
        }
    }
    


        
         
        

   
           
    //@PutMapping("/{id}")
    //public MaintenanceDTO updateMaintenance(@PathVariable Long id, @RequestBody MaintenanceDTO maintenanceDTO) {
      ///  return maintenanceService.updateMaintenance(id, maintenanceDTO);
        		
    //}
    
    @PutMapping("/{id}")
    public MaintenanceDTO updateMaintenance(@PathVariable Long id, @RequestBody MaintenanceDTO maintenancedto) {
        return maintenanceService.updateMaintenance(id, maintenancedto);
    }



    // Supprimer une maintenance
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
        
        
    } 
    
    public class NextRepetitionDatesResponse {
        private List<Date> nextRepetitionDates;

        public NextRepetitionDatesResponse(List<Date> nextRepetitionDates) {
            this.nextRepetitionDates = nextRepetitionDates;
        }

        public List<Date> getNextRepetitionDates() {
            return nextRepetitionDates;
        }

        public void setNextRepetitionDates(List<Date> nextRepetitionDates) {
            this.nextRepetitionDates = nextRepetitionDates;
        }
    }
    
    @PostMapping("/next-dates")
    public NextRepetitionDatesResponse getNextRepetitionDates(@RequestBody MaintenanceDTO maintenanceDTO) {
        // Appel de la méthode dans le service pour obtenir toutes les dates de répétition
        List<Date> nextDates = maintenanceService.getRepetitionDates(maintenanceDTO.getStartDaterep(), maintenanceDTO.getEndDaterep(), maintenanceDTO.getRepetitiontype());

        // Retourner l'objet avec la liste des dates de répétition
        return new NextRepetitionDatesResponse(nextDates);
    }
    
    
 // Expose l'endpoint pour tester la méthode
    @GetMapping("/verifierSeuil")
    public String verifierSeuil(@RequestParam String nomIndice) {
        return maintenanceService.verifierSeuilMaintenance(nomIndice);
    }
    
    @GetMapping("/Technicien/{technicien_maintenance_id_id}")
    public List<MaintenanceDTO> getInterventionsByTechnicien(@PathVariable Long technicien_maintenance_id_id) {
        return maintenanceService.getMaintenancesByTechnicien(technicien_maintenance_id_id);
    }

    @GetMapping("/technician/workload/{id}")
    public ResponseEntity<Integer> getTechnicianWorkload(@PathVariable("id") Long technicianId) {
        int workload = maintenanceService.getTechnicianWorkload(technicianId);
        return ResponseEntity.ok(workload);

    }  }

    
 
