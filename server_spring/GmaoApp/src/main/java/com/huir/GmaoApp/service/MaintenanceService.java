package com.huir.GmaoApp.service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import java.util.Date;
import java.util.Calendar;


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
import com.huir.GmaoApp.model.repetitiontype;
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
        maintenance.setUser(maintenancedto.getUser()); 
        maintenance.setRepetitiontype(maintenancedto.getRepetitiontype());  
        maintenance.setStartDaterep(maintenancedto.getStartDaterep());
        maintenance.setEndDaterep(maintenancedto.getEndDaterep());
        maintenance.setSelectedjours(maintenancedto.getSelectedjours());
        maintenance.setSelectedmois(maintenancedto.getSelectedmois());
        maintenance.setIndicateurs(maintenancedto.getIndicateurs());
        

        // Sérialisation des indicateurs sous forme JSON  ajouter date start et add aend des aintenance
     //   if (maintenancedto.getIndicateurs() != null && !maintenancedto.getIndicateurs().isEmpty()) {
       //     ObjectMapper objectMapper = new ObjectMapper();
         //   try {
                // Convertir la liste d'IndicateurDTO en chaîne JSON
           //     String indicateursJson = objectMapper.writeValueAsString(maintenancedto.getIndicateurs());
             //   maintenance.setIndicateurs(indicateursJson);  // Stocker le JSON dans la base de données
            //} catch (JsonProcessingException e) {
              //  e.printStackTrace();
            //}
        //}
 
        // Calcul de la durée d'intervention
        long duree = maintenancedto.getDureeIntervention(); // On suppose que cette méthode existe dans le DTO
       // maintenance.setDureeIntervention(duree);
        
        
        
        
       
        
        
    
        ////////  EVENT  ////////
        Event event = new Event();
        event.setStartDate(maintenancedto.getStartDate());
        event.setEndDate(maintenancedto.getEndDate());
       
        //event.setSelectedDays(maintenancedto.getSelectedDays());
        event.setSelectedMonth(maintenancedto.getSelectedMonth());
     // Conversion du String en enum RepetitionType
        try {
            repetitiontype repetitionType = repetitiontype.valueOf(maintenancedto.getRepetitionType());
            event.setRepetitionType(repetitionType);
        } catch (IllegalArgumentException e) {
            // Si la chaîne n'est pas valide, gérer l'erreur (par exemple, en assignant une valeur par défaut)
            event.setRepetitionType(repetitiontype.MENSUEL
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
    
    public Date calculerDateRepetition(Date startDaterep, Date endDaterep, repetitiontype repetitiontype) {
        if (startDaterep == null || repetitiontype == null) {
            return null; // Pas de calcul si la date de début ou le type de répétition est manquant
        }

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDaterep);

        switch (repetitiontype) {
            case TOUS_LES_JOURS:
                calendar.add(Calendar.DAY_OF_MONTH, 1);
                break;
            case TOUS_LES_SEMAINES:
                calendar.add(Calendar.WEEK_OF_YEAR, 1);
                break;
            case MENSUEL:
                calendar.add(Calendar.MONTH, 1);
                break;
            case ANNUEL:
                calendar.add(Calendar.YEAR, 1);
                break;
            case Ne_pas_repeter:
            default:
                return null; // Pas de répétition
        }

        Date daterepetition = (Date) calendar.getTime();

        // Vérifier si la date de répétition dépasse la date de fin
        if (endDaterep != null && daterepetition.after(endDaterep)) {
            return null; // La répétition ne doit pas dépasser la date de fin
        }

        return daterepetition;
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
            maintenance.setUser(maintenancedto.getUser());
            maintenance.setRepetitiontype(maintenancedto.getRepetitiontype());  
            maintenance.setStartDaterep(maintenancedto.getStartDaterep());
            maintenance.setEndDaterep(maintenancedto.getEndDaterep());
            maintenance.setSelectedjours(maintenancedto.getSelectedjours());
            maintenance.setSelectedmois(maintenancedto.getSelectedmois());
            maintenance.setIndicateurs(maintenancedto.getIndicateurs());
            
            
        //    if (maintenancedto.getIndicateurs() != null && !maintenancedto.getIndicateurs().isEmpty()) {
          //      ObjectMapper objectMapper = new ObjectMapper();
            //    try {
              //      String indicateursJson = objectMapper.writeValueAsString(maintenancedto.getIndicateurs());
                //    maintenance.setIndicateurs(indicateursJson);
                //} catch (JsonProcessingException e) {
                  //  e.printStackTrace();
                //}
            //}
            
            // hadi/////
            long count = calculerRepetition(maintenancedto.getStartDaterep(), maintenancedto.getEndDaterep(),maintenancedto.getRepetitiontype());
            maintenance.setRepetition(count);
            // Calcul de la durée d'intervention
            long duree = calculerDureeIntervention(maintenancedto.getDateDebutPrevue(), maintenancedto.getDateFinPrevue());
            maintenance.setDureeIntervention(duree);

            // Sérialisation des indicateurs sous forme JSON
           

            // Sauvegarder la maintenance mise à jour dans la base de données
            maintenanceRepository.save(maintenance);
            return new MaintenanceDTO(maintenance); // Retourne le DTO de la maintenance mise à jour
        } else {
            return null; // La maintenance n'a pas été trouvée ma
        }
        
        
    }

    
    
    
    // Méthode pour calculer la durée de répétition
    private long calculerDureeRepetition(Date debut, Date fin) {
        if (debut != null && fin != null) {
            long diffInMillies = Math.abs(fin.getTime() - debut.getTime());
            return TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
        }
        return 0;
    }
    
    
    
    
    public List<Date> getRepetitionDates(Date startDaterep, Date endDaterep, repetitiontype repetitiontype) {
        if (startDaterep == null || endDaterep == null || repetitiontype == null) {
            return null; // Si les données de départ ou de fin ou le type de répétition sont manquantes
        }

        List<Date> repetitionDates = new ArrayList<>();
        
        // Création d'une instance Calendar pour manipuler la date
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDaterep);  // Initialisation de la date dans le calendrier

        // Ajouter la première date de répétition
        repetitionDates.add(calendar.getTime());

        // Tant que la date actuelle est avant la date de fin, on calcule la prochaine date
        while (calendar.getTime().before(endDaterep)) {
            // Calcul de la prochaine date de répétition en fonction du type de répétition
            switch (repetitiontype) {
                case TOUS_LES_JOURS:
                    calendar.add(Calendar.DAY_OF_MONTH, 1);  // Ajouter 1 jour
                    break;
                case TOUS_LES_SEMAINES:
                    calendar.add(Calendar.WEEK_OF_YEAR, 1);  // Ajouter 1 semaine
                    break;
                case MENSUEL:
                    calendar.add(Calendar.MONTH, 1);  // Ajouter 1 mois
                    break;
                case ANNUEL:
                    calendar.add(Calendar.YEAR, 1);  // Ajouter 1 an
                    break;
                case Ne_pas_repeter:
                default:
                    return repetitionDates;  // Pas de répétition, retourne les dates calculées
            }

            // Ajouter la date à la liste des répétitions si elle est avant la date de fin
            if (!calendar.getTime().after(endDaterep)) {
                repetitionDates.add(calendar.getTime());
            }
        }

        return repetitionDates;
    }
    
    ////////////////////////
    
    public Maintenance getMaintenanceWithRepetitionDates(Maintenance maintenance) {
        maintenance.calculateRepetitionDates(); // Calculer les dates de répétition
        return maintenance;
    }
    
    /////////////////HADO////////////
/////HADI/////////
		 private long calculerRepetition( Date startDaterep, Date endDaterep,repetitiontype repetitiontype) {
		        if (startDaterep == null || endDaterep == null || repetitiontype == null) {
		            return 0; // Si les données sont manquantes, retourner 0
		        }

		        // Si la répétition est désactivée, retourner 1 (seulement la date de début)
		        if (repetitiontype == repetitiontype.Ne_pas_repeter) {
		            return 1;
		        }

		        // Créer une instance de Calendar pour manipuler les dates
		        Calendar calendar = Calendar.getInstance();
		        calendar.setTime(startDaterep);

		        long count = 1; // Commencer à 1 pour inclure la date de début

		        // Calculer les dates de répétition en fonction du type de répétition
		        while (true) {
		            switch (repetitiontype) {
		                case TOUS_LES_JOURS:
		                    calendar.add(Calendar.DAY_OF_MONTH, 1); // Ajouter 1 jour
		                    break;
		                case TOUS_LES_SEMAINES:
		                    calendar.add(Calendar.WEEK_OF_YEAR, 1); // Ajouter 1 semaine
		                    break;
		                case MENSUEL:
		                    calendar.add(Calendar.MONTH, 1); // Ajouter 1 mois
		                    break;
		                case ANNUEL:
		                    calendar.add(Calendar.YEAR, 1); // Ajouter 1 an
		                    break;
		                default:
		                    return count; // Cas par défaut (Ne_pas_repeter déjà géré)
		            }

		            // Vérifier que la date calculée ne dépasse pas endDaterep
		            Date nextDate = calendar.getTime();
		            if (nextDate.after(endDaterep)) {
		                break; // Si la date dépasse endDaterep, arrêter la boucle
		            }

		            count++; // Incrémenter le compteur
		        }

		        return count; // Retourner le nombre de dates de maintenance
		    }
	
		

}

    