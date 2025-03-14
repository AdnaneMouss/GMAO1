package com.huir.GmaoApp.service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.huir.GmaoApp.dto.MaintenancePeriodiqueDTO;
import com.huir.GmaoApp.model.MaintenancePeriodique;
import com.huir.GmaoApp.repository.MaintenancePeriodiqueRepository;
import com.huir.GmaoApp.repository.MaintenanceRepository;


@Service
public class MaintenancePeriodiqueService {

    @Autowired
    private final MaintenancePeriodiqueRepository maintenancePeriodiqueRepository;
    
    public MaintenancePeriodiqueService( MaintenanceRepository maintenanceRepository,
            MaintenancePeriodiqueRepository maintenancePeriodiqueRepository)
           {

     
        this.maintenancePeriodiqueRepository = maintenancePeriodiqueRepository;
       
    } 
  
  
    @Transactional
    public void addMaintenance(MaintenancePeriodiqueDTO maintenancePeriodiqueDTO) {
    	MaintenancePeriodique maintenancePeriodique   = new MaintenancePeriodique();
        maintenancePeriodique.setDateDebutPrevue(maintenancePeriodiqueDTO.getDateDebutPrevue());
    	maintenancePeriodique.setFrequence(maintenancePeriodiqueDTO.getFrequence());
    	maintenancePeriodique.setCommentaires(maintenancePeriodique.getCommentaires());
    	maintenancePeriodique.setPriorite(maintenancePeriodique.getPriorite());
    	maintenancePeriodique.setStatut(maintenancePeriodique.getStatut());
    	maintenancePeriodique.setDateDebutPrevue(maintenancePeriodique.getDateDebutPrevue());
    	maintenancePeriodique.setDateFinPrevue(maintenancePeriodique.getDateFinPrevue());
    	maintenancePeriodique.setDateProchainemaintenance(maintenancePeriodique.getDateProchainemaintenance());
    	maintenancePeriodique.setDocumentPath(maintenancePeriodique.getDocumentPath());

       
    }

        
   
    
    // Find  by ID
    public Optional<MaintenancePeriodique> findMaintenancePeriodiqueById(Long id) {
        return maintenancePeriodiqueRepository.findById(id);
    }
    
    // Get all 
    public List<MaintenancePeriodique> findAllMaintenancesPeriodique() {
         return maintenancePeriodiqueRepository.findAll();
    }
 // Delete 
    public void deleteMaintenancePeriodique(Long id) {
    	maintenancePeriodiqueRepository.deleteById(id);
    }
    //update
    @Transactional
    public MaintenancePeriodiqueDTO updateMaintenancePeriodique(Long id, MaintenancePeriodiqueDTO  maintenancePeriodiqueDTO) {
        Optional<MaintenancePeriodique> optionalMaintenancePeriodique = maintenancePeriodiqueRepository.findById(id);
        if (optionalMaintenancePeriodique.isPresent()) {
        	MaintenancePeriodique maintenancePeriodique = optionalMaintenancePeriodique.get();
            // Update  fields
        	maintenancePeriodique.setFrequence(maintenancePeriodiqueDTO.getFrequence());
        	maintenancePeriodique.setCommentaires(maintenancePeriodique.getCommentaires());
        	maintenancePeriodique.setPriorite(maintenancePeriodique.getPriorite());
        	maintenancePeriodique.setStatut(maintenancePeriodique.getStatut());
        	maintenancePeriodique.setDateDebutPrevue(maintenancePeriodique.getDateDebutPrevue());
        	maintenancePeriodique.setDateFinPrevue(maintenancePeriodique.getDateFinPrevue());
        	maintenancePeriodique.setDateProchainemaintenance(maintenancePeriodique.getDateProchainemaintenance());
        	maintenancePeriodique.setDocumentPath(maintenancePeriodique.getDocumentPath());
              
            // Save updated  entity
        	maintenancePeriodiqueRepository.save(maintenancePeriodique);
            return new MaintenancePeriodiqueDTO(maintenancePeriodique);
        } else {
            return null; //  not found
        }
    }
    
   
    }