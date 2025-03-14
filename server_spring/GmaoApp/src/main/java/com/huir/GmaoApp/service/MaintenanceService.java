package com.huir.GmaoApp.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huir.GmaoApp.dto.EventDTO;
import com.huir.GmaoApp.dto.IndicateurDTO;
import com.huir.GmaoApp.dto.MaintenanceDTO;
import com.huir.GmaoApp.model.Event;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.RepetitionType;
import com.huir.GmaoApp.repository.EventRepository;
import com.huir.GmaoApp.repository.MaintenanceRepository;

@Service
public class MaintenanceService {

    @Autowired
    private final MaintenanceRepository maintenanceRepository;
    
    @Autowired
    private final EventRepository eventRepository;

    
    public MaintenanceService(MaintenanceRepository maintenanceRepository , EventRepository eventRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.eventRepository  =  eventRepository;
    }

    // Méthode pour ajouter une maintenance
    @Transactional
    public void addMaintenance(MaintenanceDTO maintenancedto) {
        Maintenance maintenance = new Maintenance();
        maintenance.setCommentaires(maintenancedto.getCommentaires());
        maintenance.setPriorite(maintenancedto.getPriorite());
        maintenance.setStatut(maintenancedto.getStatut());
        maintenance.setDateDebutPrevue(maintenancedto.getDateDebutPrevue());
        maintenance.setDateFinPrevue(maintenancedto.getDateFinPrevue());
        maintenance.setDateProchainemaintenance(maintenancedto.getDateProchainemaintenance());
        maintenance.setDocumentPath(maintenancedto.getDocumentPath());
        maintenance.setFrequence(maintenancedto.getFrequence());
        maintenance.setAction(maintenancedto.getAction());   
        maintenance.setAutreAction(maintenancedto.getAutreAction());
        maintenance.setTechnicienMaintenance(maintenancedto.getTechnicienId());   

        // Sérialisation des indicateurs sous forme JSON
        if (maintenancedto.getIndicateurs() != null && !maintenancedto.getIndicateurs().isEmpty()) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                // Convertir la liste d'IndicateurDTO en chaîne JSON
                String indicateursJson = objectMapper.writeValueAsString(maintenancedto.getIndicateurs());
                maintenance.setIndicateurs(indicateursJson);  // Stocker le JSON dans la base de données
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
 
        // Calcul de la durée d'intervention
        long duree = maintenancedto.getDureeIntervention(); // On suppose que cette méthode existe dans le DTO
        maintenance.setDureeIntervention(duree);
        ////////  EVENT  ////////
        Event event = new Event();
        event.setStartDate(maintenancedto.getStartDate());
        event.setEndDate(maintenancedto.getEndDate());
       
        event.setSelectedDays(maintenancedto.getSelectedDays());
        event.setSelectedMonth(maintenancedto.getSelectedMonth());
     // Conversion du String en enum RepetitionType
        try {
            RepetitionType repetitionType = RepetitionType.valueOf(maintenancedto.getRepetitionType());
            event.setRepetitionType(repetitionType);
        } catch (IllegalArgumentException e) {
            // Si la chaîne n'est pas valide, gérer l'erreur (par exemple, en assignant une valeur par défaut)
            event.setRepetitionType(RepetitionType.MENSUEL
            		);  // Exemple de valeur par défaut
        }
        

        maintenance.setEvent(event);
        eventRepository.save(event);
        
        
        
        
        
        
        // Sauvegarder la maintenance dans la base de données
        maintenanceRepository.save(maintenance);
    }

    // Méthode pour calculer la durée d'intervention
    private long calculerDureeIntervention(LocalDate debut, LocalDate fin) {
        if (debut != null && fin != null) {
            return ChronoUnit.DAYS.between(debut, fin);
        }
        return 0;
    }

    // Trouver une maintenance par ID
    public Optional<Maintenance> findMaintenanceById(Long id) {
        return maintenanceRepository.findById(id);
    }

    // Récupérer toutes les maintenances
    public List<Maintenance> findAllMaintenances() {
        return maintenanceRepository.findAll();
    }

    // Supprimer une maintenance
    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }
    
    public void handleFrequenceAndIndicateur(MaintenanceDTO maintenanceDTO) {
        // Si la fréquence est remplie, réinitialiser les indicateurs
        if (maintenanceDTO.getFrequence() != null) {
            maintenanceDTO.setIndicateurs(null); // Réinitialise les indicateurs si la fréquence est définie
        }
      
        // Si les indicateurs sont remplis, réinitialiser la fréquence
        if (maintenanceDTO.getIndicateurs() != null && !maintenanceDTO.getIndicateurs().isEmpty()) {
            maintenanceDTO.setFrequence(null); // Réinitialise la fréquence si les indicateurs sont définis
        }
    }


    // Méthode pour mettre à jour une maintenance
    @Transactional
    public MaintenanceDTO updateMaintenance(Long id, MaintenanceDTO maintenancedto) {
        Optional<Maintenance> optionalMaintenance = maintenanceRepository.findById(id);
        if (optionalMaintenance.isPresent()) {
            Maintenance maintenance = optionalMaintenance.get();

            // Mise à jour des champs
            maintenance.setCommentaires(maintenancedto.getCommentaires());
            maintenance.setPriorite(maintenancedto.getPriorite());
            maintenance.setStatut(maintenancedto.getStatut());
            maintenance.setDateDebutPrevue(maintenancedto.getDateDebutPrevue());
            maintenance.setDateFinPrevue(maintenancedto.getDateFinPrevue());
            maintenance.setDateProchainemaintenance(maintenancedto.getDateProchainemaintenance());
            maintenance.setDocumentPath(maintenancedto.getDocumentPath());
            maintenance.setFrequence(maintenancedto.getFrequence());
            maintenance.setAction(maintenancedto.getAction());   
            maintenance.setAutreAction(maintenancedto.getAutreAction());

            // Calcul de la durée d'intervention
            long duree = calculerDureeIntervention(maintenancedto.getDateDebutPrevue(), maintenancedto.getDateFinPrevue());
            maintenance.setDureeIntervention(duree);

            // Sérialisation des indicateurs sous forme JSON
            if (maintenancedto.getIndicateurs() != null && !maintenancedto.getIndicateurs().isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                try {
                    String indicateursJson = objectMapper.writeValueAsString(maintenancedto.getIndicateurs());
                    maintenance.setIndicateurs(indicateursJson);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }

            // Sauvegarder la maintenance mise à jour dans la base de données
            maintenanceRepository.save(maintenance);
            return new MaintenanceDTO(maintenance); // Retourne le DTO de la maintenance mise à jour
        } else {
            return null; // La maintenance n'a pas été trouvée
        }
        
        
    }
}
