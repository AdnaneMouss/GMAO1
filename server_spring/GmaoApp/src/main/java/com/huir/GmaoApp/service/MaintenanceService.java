package com.huir.GmaoApp.service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.HashSet;
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
    
    public Date calculerDateRepetition(Date startDaterep, Date endDaterep, 
            repetitiontype repetitiontype, List<String> selectedjours) {
if (startDaterep == null || repetitiontype == null) {
return null;
}

Calendar calendar = Calendar.getInstance();
calendar.setTime(startDaterep);

switch (repetitiontype) {
case TOUS_LES_JOURS:
calendar.add(Calendar.DAY_OF_MONTH, 1);
break;
case TOUS_LES_SEMAINES:
if (selectedjours != null && !selectedjours.isEmpty()) {
return calculerProchaineDateHebdomadaire(calendar, endDaterep, selectedjours);
} else {
calendar.add(Calendar.WEEK_OF_YEAR, 1);
}
break;
case MENSUEL:
calendar.add(Calendar.MONTH, 1);
break;
case ANNUEL:
calendar.add(Calendar.YEAR, 1);
break;
case Ne_pas_repeter:
default:
return null;
}

Date daterepetition = calendar.getTime();
if (endDaterep != null && daterepetition.after(endDaterep)) {
return null;
}
return daterepetition;
}

private Date calculerProchaineDateHebdomadaire(Calendar startCalendar, 
                        Date endDaterep, 
                        List<String> selectedjours) {
Calendar calendar = (Calendar) startCalendar.clone();
Date currentDate = calendar.getTime();

// Vérifier les jours dans la semaine courante
for (String jour : selectedjours) {
int dayOfWeek = convertDayToCalendarConstant(jour.trim());
calendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);

if (calendar.getTime().after(currentDate)) {
if (endDaterep == null || !calendar.getTime().after(endDaterep)) {
return calendar.getTime();
}
}
}

// Passer à la semaine suivante
calendar.add(Calendar.WEEK_OF_YEAR, 1);
calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);

for (String jour : selectedjours) {
int dayOfWeek = convertDayToCalendarConstant(jour.trim());
calendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);

if (endDaterep == null || !calendar.getTime().after(endDaterep)) {
return calendar.getTime();
}
}

return null;
}

//Méthode de conversion inchangée
private int convertDayToCalendarConstant(String day) {
switch (day.toUpperCase()) {
case "LUNDI": return Calendar.MONDAY;
case "MARDI": return Calendar.TUESDAY;
case "MERCREDI": return Calendar.WEDNESDAY;
case "JEUDI": return Calendar.THURSDAY;
case "VENDREDI": return Calendar.FRIDAY;
case "SAMEDI": return Calendar.SATURDAY;
case "DIMANCHE": return Calendar.SUNDAY;
default: return Calendar.MONDAY;
}
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
            long count = calculerRepetition(maintenancedto.getStartDaterep(), maintenancedto.getEndDaterep(),maintenancedto.getRepetitiontype(),maintenancedto.getSelectedjours());
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
    
    
    
    
    public List<Date> getRepetitionDates(Date startDaterep, Date endDaterep, 
            repetitiontype repetitiontype, 
            List<String> selectedjours) {
// Validation des paramètres
if (startDaterep == null || endDaterep == null || repetitiontype == null) {
return Collections.emptyList(); // Retourne une liste vide au lieu de null
}

List<Date> repetitionDates = new ArrayList<>();
Calendar calendar = Calendar.getInstance();
calendar.setTime(startDaterep);

// Ajout de la date de départ
repetitionDates.add(calendar.getTime());

// Cas spécial pour les répétitions hebdomadaires avec jours spécifiques
if (repetitiontype == repetitiontype.TOUS_LES_SEMAINES && 
selectedjours != null && !selectedjours.isEmpty()) {
addWeeklyRepetitionDates(calendar, endDaterep, selectedjours, repetitionDates);
} else {
// Calcul standard pour les autres types de répétition
addStandardRepetitionDates(calendar, endDaterep, repetitiontype, repetitionDates);
}

return repetitionDates;
}

private void addStandardRepetitionDates(Calendar calendar, Date endDaterep,
              repetitiontype repetitiontype,
              List<Date> repetitionDates) {
while (calendar.getTime().before(endDaterep)) {
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
return;
}

if (!calendar.getTime().after(endDaterep)) {
repetitionDates.add(calendar.getTime());
}
}
}

private void addWeeklyRepetitionDates(Calendar startCalendar, Date endDaterep,
            List<String> selectedjours,
            List<Date> repetitionDates) {
Calendar calendar = (Calendar) startCalendar.clone();
int currentDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);

// Traitement de la semaine en cours
processCurrentWeek(calendar, endDaterep, selectedjours, repetitionDates, currentDayOfWeek);

// Traitement des semaines suivantes
while (true) {
calendar.add(Calendar.WEEK_OF_YEAR, 1);
boolean weekAdded = false;

for (String jour : selectedjours) {
int dayOfWeek = convertDayToCalendarConstant(jour);
calendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);

if (!calendar.getTime().after(endDaterep)) {
repetitionDates.add(calendar.getTime());
weekAdded = true;
}
}

if (!weekAdded) break;
}
}

private void processCurrentWeek(Calendar calendar, Date endDaterep,
      List<String> selectedjours,
      List<Date> repetitionDates,
      int currentDayOfWeek) {
Calendar tempCalendar = (Calendar) calendar.clone();

for (String jour : selectedjours) {
int dayOfWeek = convertDayToCalendarConstant(jour);
if (dayOfWeek > currentDayOfWeek) {
tempCalendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);
if (!tempCalendar.getTime().after(endDaterep)) {
repetitionDates.add(tempCalendar.getTime());
}
}
}
}



    ////////////////////////
    
    public Maintenance getMaintenanceWithRepetitionDates(Maintenance maintenance) {
        maintenance.calculateRepetitionDates(); // Calculer les dates de répétition
        return maintenance;
    }
    
    /////////////////HADO////////////
/////HADI/////////
    private long calculerRepetition(Date startDaterep, Date endDaterep, 
            repetitiontype repetitiontype,
            List<String> selectedjours) {
// Validation des paramètres
if (startDaterep == null || endDaterep == null || repetitiontype == null) {
return 0;
}

// Cas où la répétition est désactivée
if (repetitiontype == repetitiontype.Ne_pas_repeter) {
return 1;
}

Calendar calendar = Calendar.getInstance();
calendar.setTime(startDaterep);
long count = 1; // On compte déjà la date de départ

// Cas spécial pour les répétitions hebdomadaires avec jours spécifiques
if (repetitiontype == repetitiontype.TOUS_LES_SEMAINES && 
selectedjours != null && !selectedjours.isEmpty()) {
return compterRepetitionsHebdomadaires(calendar, endDaterep, selectedjours);
}

// Calcul standard pour les autres types de répétition
while (true) {
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
default:
return count;
}

if (calendar.getTime().after(endDaterep)) {
break;
}
count++;
}

return count;
}

private long compterRepetitionsHebdomadaires(Calendar startCalendar, 
                         Date endDaterep,
                         List<String> selectedjours) {
long count = 1; // On compte la date de départ
Calendar calendar = (Calendar) startCalendar.clone();

// 1. Compter les jours restants dans la semaine de départ
count += compterJoursSemaineCourante(calendar, endDaterep, selectedjours);

// 2. Compter les semaines complètes suivantes
calendar.add(Calendar.WEEK_OF_YEAR, 1);
calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY); // Début de semaine

while (true) {
int joursAjoutes = 0;

for (String jour : selectedjours) {
int dayOfWeek = convertDayToCalendarConstant(jour.trim());
calendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);

if (!calendar.getTime().after(endDaterep)) {
joursAjoutes++;
}
}

if (joursAjoutes == 0) {
break; // On a dépassé la date de fin
}

count += joursAjoutes;
calendar.add(Calendar.WEEK_OF_YEAR, 1);
}

return count;
}

private long compterJoursSemaineCourante(Calendar calendar, 
                     Date endDaterep,
                     List<String> selectedjours) {
long count = 0;
Date currentDate = calendar.getTime();
int currentDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);

for (String jour : selectedjours) {
int dayOfWeek = convertDayToCalendarConstant(jour.trim());

// On ne compte que les jours après le jour courant
if (dayOfWeek > currentDayOfWeek) {
calendar.set(Calendar.DAY_OF_WEEK, dayOfWeek);
if (!calendar.getTime().after(endDaterep)) {
count++;
}
}
}

return count;
}

public List<Date> calculateRepetitionDates(
	    Date startDate, 
	    Date endDate,
	    repetitiontype repetitionType,
	    List<String> selectedDays) {
	    
	    List<Date> dates = new ArrayList<>();
	    Calendar calendar = Calendar.getInstance();
	    calendar.setTime(startDate);

	    // Ajout de la date de départ
	    dates.add(calendar.getTime());

	    while (calendar.getTime().before(endDate)) {
	        switch (repetitionType) {
	            case TOUS_LES_JOURS:
	                calendar.add(Calendar.DAY_OF_MONTH, 1);
	                break;
	                
	            case TOUS_LES_SEMAINES:
	                if (selectedDays != null && !selectedDays.isEmpty()) {
	                    return calculateWeeklyDatesWithSelectedDays(calendar, endDate, selectedDays);
	                }
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
	                return dates;
	        }

	        if (!calendar.getTime().after(endDate)) {
	            dates.add(calendar.getTime());
	        }
	    }
	    return dates;
	}

	private List<Date> calculateWeeklyDatesWithSelectedDays(
	    Calendar startCalendar,
	    Date endDate,
	    List<String> selectedDays) {
	    
	    List<Date> dates = new ArrayList<>();
	    Set<String> addedDates = new HashSet<>(); // Pour éviter les doublons
	    
	    // Convertir les noms de jours en numéros (LUNDI=1, MARDI=2,... DIMANCHE=7)
	    List<Integer> dayNumbers = selectedDays.stream()
	        .map(this::convertDayNameToNumber)
	        .filter(n -> n >= 0)
	        .collect(Collectors.toList());

	    Calendar calendar = (Calendar) startCalendar.clone();
	    
	    // Parcourir chaque jour dans la période
	    while (calendar.getTime().before(endDate) || calendar.getTime().equals(endDate)) {
	        int currentDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
	        
	        // Vérifier si le jour actuel est sélectionné
	        if (dayNumbers.contains(currentDayOfWeek)) {
	            String dateKey = calendar.get(Calendar.YEAR) + "-" 
	                          + calendar.get(Calendar.MONTH) + "-" 
	                          + calendar.get(Calendar.DAY_OF_MONTH);
	            
	            if (!addedDates.contains(dateKey)) {
	                dates.add(calendar.getTime());
	                addedDates.add(dateKey);
	            }
	        }
	        calendar.add(Calendar.DAY_OF_MONTH, 1);
	    }
	    
	    return dates;
	}

	private int convertDayNameToNumber(String dayName) {
	    switch (dayName.toUpperCase()) {
	        case "LUNDI": return Calendar.MONDAY;
	        case "MARDI": return Calendar.TUESDAY;
	        case "MERCREDI": return Calendar.WEDNESDAY;
	        case "JEUDI": return Calendar.THURSDAY;
	        case "VENDREDI": return Calendar.FRIDAY;
	        case "SAMEDI": return Calendar.SATURDAY;
	        case "DIMANCHE": return Calendar.SUNDAY;
	        default: return -1;
	    }
	}



	
		

}

    