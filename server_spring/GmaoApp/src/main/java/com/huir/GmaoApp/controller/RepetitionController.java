package com.huir.GmaoApp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.model.RepetitionInstance;
import com.huir.GmaoApp.repository.RepetitionInstanceRepository;
import com.huir.GmaoApp.service.RepetitionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/repetitions")
@RequiredArgsConstructor
public class RepetitionController {
	 @Autowired
	 private  RepetitionInstanceRepository RepetitionInstanceRepository;
	
	 
	  @Autowired
      private RepetitionService repetitionService;


	    @GetMapping("/maintenance/{id}")
	    public List<RepetitionInstance> getByMaintenanceId(@PathVariable Long id) {
	        return RepetitionInstanceRepository.findByMaintenance_Id(id);
	    }
	    
	    @GetMapping
	    public List<RepetitionInstance> getAllRepetitions() {
	        return RepetitionInstanceRepository.getAllRepetitions();
	    }
	    
	   
	    
	    
	

	      
	        @PutMapping("/{id}/start")
	        public ResponseEntity<RepetitionInstance> startTask(@PathVariable Long id) {
	            RepetitionInstance updatedMaintenance = repetitionService.startTask(id);
	            if (updatedMaintenance != null) {
	                return ResponseEntity.ok(updatedMaintenance);
	            } else {
	                return ResponseEntity.status(400).body(null);
	            }
	        }
	        
	        
	        @PutMapping("/{id}/complete")
	        public ResponseEntity<?> markAsCompleted(@PathVariable Long id) {
	            try {
	            	RepetitionInstance updatedMaintenance = repetitionService.markAsCompleted(id);
	                if (updatedMaintenance != null) {
	                    return ResponseEntity.ok(updatedMaintenance);
	                } else {
	                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                        .body("Maintenance with id " + id + " not found or cannot be completed.");
	                }
	            } catch (Exception e) {
	                e.printStackTrace(); // Log l’exception complète
	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body("An error occurred: " + e.getMessage());
	            }
	        }
	        
	        
	    

}
