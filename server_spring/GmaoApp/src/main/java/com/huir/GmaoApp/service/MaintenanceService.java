package com.huir.GmaoApp.service;


import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.Calendar;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.EventDTO;
import com.huir.GmaoApp.dto.IndicateurDTO;
import com.huir.GmaoApp.dto.MaintenanceCorrectiveDTO;
import com.huir.GmaoApp.dto.MaintenanceDTO;
import com.huir.GmaoApp.model.AttributEquipementValeur;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.Event;
import com.huir.GmaoApp.model.Indice;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.model.Priorite;
import com.huir.GmaoApp.model.Statut;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.model.repetitiontype;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.AttributEquipementsValeursRepository;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.EventRepository;
import com.huir.GmaoApp.repository.IndiceRepository;
import com.huir.GmaoApp.repository.MaintenanceRepository;
import com.huir.GmaoApp.repository.UserRepository;

@Service
public class MaintenanceService {

    @Autowired
    private final MaintenanceRepository maintenanceRepository;
    
    @Autowired
    private final EventRepository eventRepository;
    
    @Autowired
    private final EquipementRepository equipementRepository;
    
    @Autowired
    private final UserRepository userRepository;
    
    @Autowired
    private final EmailService emailService;
    
    
    

	@Autowired
	private AttributEquipementsRepository attributEquipementsRepository;
	@Autowired
	private AttributEquipementsValeursRepository attributEquipementsValeursRepository;



	@Autowired
    private  IndiceRepository indiceRepository;

	private EquipementRepository EquipementRepository;
	private static final Logger logger = LoggerFactory.getLogger(MaintenanceService.class);

    
    public MaintenanceService(MaintenanceRepository maintenanceRepository , EventRepository eventRepository,EmailService emailService,EquipementRepository equipementRepository,UserRepository userRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.eventRepository  =  eventRepository;
		this.equipementRepository = equipementRepository;
        this.emailService=emailService;
        this.userRepository =userRepository;
     
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
        maintenance.setSeuil(maintenancedto.getSeuil());
        maintenance.setEquipementId(maintenancedto.getEquipementId()); 
        maintenance.setNonSeuil(maintenancedto.getNonSeuil());
        //maintenance.setNextRepetitionDatesAsList(maintenancedto.getNextRepetitionDatesAsList());
        


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
       // Event event = new Event();
       // event.setStartDate(maintenancedto.getStartDate());
        //event.setEndDate(maintenancedto.getEndDate());
       
        //event.setSelectedDays(maintenancedto.getSelectedDays());
        //event.setSelectedMonth(maintenancedto.getSelectedMonth());
     // Conversion du String en enum RepetitionType
        //try {
          //  repetitiontype repetitionType = repetitiontype.valueOf(maintenancedto.getRepetitionType());
            //event.setRepetitionType(repetitionType);
       // } catch (IllegalArgumentException e) {
            // Si la chaîne n'est pas valide, gérer l'erreur (par exemple, en assignant une valeur par défaut)
         //   event.setRepetitionType(repetitiontype.MENSUEL
           // 		);  // Exemple de valeur par défaut
        //}
        

        //maintenance.setEvent(event);
       // eventRepository.save(event);
        
        
        
        
        
        
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
    
   
    @Transactional
    public MaintenanceDTO updateMaintenance(Long id, MaintenanceDTO maintenancedto) {
        Maintenance maintenance = maintenanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Maintenance non trouvée avec ID : " + id));

        // Met à jour tous les champs simples
        maintenance.setCommentaires(maintenancedto.getCommentaires());
        maintenance.setPriorite(maintenancedto.getPriorite());
        maintenance.setStatut(maintenancedto.getStatut());
        maintenance.setDateDebutPrevue(maintenancedto.getDateDebutPrevue());
        maintenance.setDateFinPrevue(maintenancedto.getDateFinPrevue());
        maintenance.setDateProchainemaintenance(maintenancedto.getDateProchainemaintenance());
        maintenance.setFrequence(maintenancedto.getFrequence());
        maintenance.setAction(maintenancedto.getAction());
        maintenance.setUser(maintenancedto.getUser());
        maintenance.setRepetitiontype(maintenancedto.getRepetitiontype());
        maintenance.setStartDaterep(maintenancedto.getStartDaterep());
        maintenance.setEndDaterep(maintenancedto.getEndDaterep());
        maintenance.setSelectedjours(maintenancedto.getSelectedjours());
        maintenance.setSelectedmois(maintenancedto.getSelectedmois());
        maintenance.setSeuil(maintenancedto.getSeuil());
        maintenance.setNonSeuil(maintenancedto.getNonSeuil());
        maintenance.setNextRepetitionDates(maintenancedto.getNextRepetitionDates());

        // Calculs
        long repetition = calculerRepetition(maintenancedto.getStartDaterep(), maintenancedto.getEndDaterep(), maintenancedto.getRepetitiontype());
        maintenance.setRepetition(repetition);

        long duree = calculerDureeIntervention(maintenancedto.getDateDebutPrevue(), maintenancedto.getDateFinPrevue());
        maintenance.setDureeIntervention(duree);

        // ✅ Corriger ici : associer l'objet Equipement
        Equipement equipement = equipementRepository.findById(maintenancedto.getEquipementId())
        	    .orElseThrow(() -> new RuntimeException("Équipement non trouvé avec ID : " + maintenancedto.getEquipementId()));
        	maintenance.setEquipement(equipement); // ✅ géré par JPA

       
        // Sauvegarde finale
        Maintenance savedMaintenance = maintenanceRepository.save(maintenance);
        return new MaintenanceDTO(savedMaintenance);
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
    public Maintenance cancelTask(Long id) {
        Optional<Maintenance> maintenanceOpt = maintenanceRepository.findById(id);
        if (maintenanceOpt.isPresent()) {
            Maintenance maintenance = maintenanceOpt.get();
            if (maintenance.getStatut() == Statut.EN_ATTENTE) {
                maintenance.setStatut(Statut.ANNULEE);
                 maintenance.setSkipRepetitionCalculation(true);
                try {
                    return maintenanceRepository.save(maintenance);
                } catch (Exception e) {
                    System.err.println("Erreur lors du save : " + e.getMessage());
                    e.printStackTrace(); // Ceci va afficher la vraie cause dans la console
                    throw e;
                }
            } else {
                System.out.println("Statut non modifiable: " + maintenance.getStatut());
            }
        } else {
            System.out.println("Maintenance introuvable avec l'ID: " + id);
        }
        return null;
    }


  
    
    /////////////////////////////
//////////////
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
		  
		    public List<MaintenanceDTO> getMaintenancesByTechnicien(Long technicienId) {
		        return maintenanceRepository.findByAffecteAId(technicienId).stream()
		                .map(MaintenanceDTO::new)
		                .collect(Collectors.toList());
		    }
		    
		    public int getTechnicianWorkload(Long technicianId) {
		        List<Maintenance> assignedTasks = maintenanceRepository.findByAffecteAIdAndStatutNotIn(technicianId, Arrays.asList(Statut.TERMINEE, Statut.ANNULEE));
		        return assignedTasks.size();
		    }
		 
		 
		 public String verifierSeuilMaintenance(String nomIndice) {
		        // 1. Chercher l'indice par son nom
		        Optional<Indice> optIndice = indiceRepository.findByNomIndice(nomIndice);
		        
		        if (optIndice.isPresent()) {
		            Indice indice = optIndice.get();

		            // 2. Chercher l'attribut avec le même nom (comparaison avec "INDICATEUR" dans la table AttributEquipements)
		            Optional<AttributEquipements> optAttr = attributEquipementsRepository.findByNom(nomIndice);
		            if (optAttr.isPresent()) {
		                AttributEquipements attribut = optAttr.get();

		                // 3. Comparer le nom de l'indice avec le nom de l'attribut
		                if (indice.getNomIndice().equals(attribut.getNom())) {
		                    
		                    // 4. Chercher la valeur liée à cet attribut
		                    Optional<AttributEquipementValeur> optValeur = attributEquipementsValeursRepository.findByAttributEquipement(attribut);
		                    if (optValeur.isPresent()) {
		                        AttributEquipementValeur valeur = optValeur.get();

		                        // 5. Comparer la valeur (String) avec le seuilIndice (Double)
		                        try {
		                            double valeurDouble = Double.parseDouble(valeur.getValeur());
		                            if (valeurDouble >= indice.getSeuilIndice()) {
		                                return "⚠️ La maintenance doit être faite (valeur atteint ou dépasse le seuil).";
		                            } else {
		                                return "✅ La valeur n’a pas encore atteint le seuil.";
		                            }
		                        } catch (NumberFormatException e) {
		                            return "Erreur : valeur non numérique.";
		                        }
		                    } else {
		                        return "Aucune valeur trouvée pour cet attribut.";
		                    }
		                } else {
		                    return "Le nom de l'indice ne correspond pas à celui de l'attribut.";
		                }
		            } else {
		                return "Attribut correspondant non trouvé.";
		            }
		        } else {
		            return "Indice non trouvé.";
		        }
		    }
		 
		   public MaintenanceDTO updateMaintenancee(Long maintenanceId, MaintenanceDTO dto) {
		        // Retrieve the existing MaintenanceCorrective by its ID
		        Optional<Maintenance> existingMaintenanceOptional = maintenanceRepository.findById(maintenanceId);

		        if (!existingMaintenanceOptional.isPresent()) {
		            System.out.println("Erreur");
		        }
		        Maintenance maintenance = existingMaintenanceOptional.get();

		        // Update the fields
		       
		        maintenance.setCommentaires(dto.getCommentaires() != null ? dto.getCommentaires() : maintenance.getCommentaires());
		       // maintenance.setStatut(dto.getStatut() != null ? Statut.valueOf(dto.getStatut()) : maintenance.getStatut());
		        //maintenance.setPriorite(dto.getPriorite() != null ? Priorite.valueOf(dto.getPriorite()) : maintenance.getPriorite());

		        // Keep the original date if not provided
		        maintenance.setDateDebutPrevue(dto.getDateDebutPrevue() != null ? dto.getDateDebutPrevue() : maintenance.getDateDebutPrevue());

		        // Update the equipment if provided
		        if (dto.getEquipementId() != null) {
		            Optional<Equipement> equipementOptional = equipementRepository.findById(dto.getEquipementId());
		            equipementOptional.ifPresent(maintenance::setEquipement);
		       }

		        // Update the technician if provided
		       

		       
		        // Save the updated maintenance corrective
		        maintenance = maintenanceRepository.save(maintenance);

		        // Optionally, send an email to the technician if assigned
		        if (maintenance.getUser() != null && maintenance.getUser().getId() != null) {
		            String subject = "Mise à jour de la maintenance corrective assignée";
		            String body = "Bonjour " + maintenance.getUser().getId() + ",\n\n"
		                    + "Une maintenance corrective a été mise à jour.\n\n"
		                    + "Titre: " + maintenance.getAction() + "\n"
		                    + "Description: " + maintenance.getCommentaires() + "\n"
		                    + "Priorité: " + maintenance.getPriorite() + "\n\n"
		                    + "Merci de bien vouloir vérifier la mise à jour.\n\n"
		                    + "Cordialement,\nL'équipe GMAO";

		           // emailService.sendEmail(maintenance.getUser().getId(), subject, body);
		        }

		        // Return the updated MaintenanceCorrective as DTO
		        return new MaintenanceDTO(maintenance);
		    }

		   
		   
		   
		   
		 
		 
		  public Maintenance markAsCompleted(Long id) {
		        Optional<Maintenance> maintenanceOpt = maintenanceRepository.findById(id);
		        if (maintenanceOpt.isPresent()) {
		            Maintenance maintenance = maintenanceOpt.get();
		            if (maintenance.getStatut() == Statut.EN_COURS) {
		                maintenance.setStatut(Statut.TERMINEE);
		                return maintenanceRepository.save(maintenance);
		            }
		        }
		        return null;
		    }
		  
		  
		    public Maintenance startTask(Long id) {
		        Optional<Maintenance> maintenanceOpt = maintenanceRepository.findById(id);
		        if (maintenanceOpt.isPresent()) {
		            Maintenance maintenance = maintenanceOpt.get();
		            if (maintenance.getStatut() == Statut.EN_ATTENTE) {
		                maintenance.setStatut(Statut.EN_COURS);
		                return maintenanceRepository.save(maintenance);
		            }
		        }
		        return null;
		    }
		    
		    
		    public void changerStatutEnTermine(Long id) {
		        Maintenance maintenance = maintenanceRepository.findById(id)
		            .orElseThrow(() -> new RuntimeException("Maintenance non trouvée avec id: " + id));

		        maintenance.setStatut(Statut.ANNULEE);
		        maintenanceRepository.save(maintenance);
		    }
		    
		    
		   

}
