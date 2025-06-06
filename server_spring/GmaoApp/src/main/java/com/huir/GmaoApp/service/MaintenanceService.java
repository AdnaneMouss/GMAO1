package com.huir.GmaoApp.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.HashMap;
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
import com.huir.GmaoApp.model.RepetitionInstance;
import com.huir.GmaoApp.model.Statut;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.model.repetitiontype;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.AttributEquipementsValeursRepository;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.EventRepository;
import com.huir.GmaoApp.repository.IndiceRepository;
import com.huir.GmaoApp.repository.MaintenanceRepository;
import com.huir.GmaoApp.repository.RepetitionInstanceRepository;
import com.huir.GmaoApp.repository.UserRepository;

@Service
public class MaintenanceService {

    @Autowired
    private final MaintenanceRepository maintenanceRepository;
    
    @Autowired
    private final RepetitionInstanceRepository repetitionInstanceRepository;
    
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
    private IndiceRepository indiceRepository;

    private static final Logger logger = LoggerFactory.getLogger(MaintenanceService.class);

    public MaintenanceService(MaintenanceRepository maintenanceRepository, 
                            EventRepository eventRepository,
                            EmailService emailService,
                            EquipementRepository equipementRepository,
                            UserRepository userRepository,
                            RepetitionInstanceRepository repetitionInstanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.eventRepository = eventRepository;
        this.equipementRepository = equipementRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.repetitionInstanceRepository = repetitionInstanceRepository;
    }
    @Transactional
    public void addMaintenance(MaintenanceDTO maintenancedto) {
        Maintenance maintenance = new Maintenance();

        maintenance.setCommentaires(maintenancedto.getCommentaires());
        maintenance.setPriorite(maintenancedto.getPriorite());
        maintenance.setStatut(maintenancedto.getStatut());
        maintenance.setDateDebutPrevue(maintenancedto.getDateDebutPrevue());
        maintenance.setDateFinPrevue(maintenancedto.getDateFinPrevue());
       // maintenance.setDateProchainemaintenance(maintenancedto.getDateProchainemaintenance());
        maintenance.setDocumentPath(maintenancedto.getDocumentPath());
        maintenance.setFrequence(maintenancedto.getFrequence());
        maintenance.setAction(maintenancedto.getAction());
        maintenance.setAutreAction(maintenancedto.getAutreAction());
        maintenance.setUser(maintenancedto.getUser());
        maintenance.setRepetitiontype(maintenancedto.getRepetitiontype());
        maintenance.setSeuil(maintenancedto.getSeuil());
        maintenance.setEquipementId(maintenancedto.getEquipementId());
        maintenance.setNonSeuil(maintenancedto.getNonSeuil());
        maintenance.setSkipRepetitionCalculation(false);
     
        
      
        if (maintenancedto.getAttributId() != null) {
            Optional<AttributEquipements> attribut = attributEquipementsRepository.findById(maintenancedto.getAttributId());

            if (attribut.isPresent()) {
                maintenance.setNonSeuil(attribut.get().getNom()); // Affecter le nom comme nonSeuil
            } else {
                // Tu peux choisir de laisser null si tu veux (ne rien faire ici)
                // maintenance.setNonSeuil(null);
                // Ou mettre un message par défaut
                maintenance.setNonSeuil("Attribut inconnu");
            }
        } else {
            // Si tu veux explicitement que ce soit null si pas d'attributId
            maintenance.setNonSeuil(null);
        }



        // Calcul de la durée de l'intervention
        long duree = calculerDureeIntervention(
            maintenancedto.getDateDebutPrevue(),
            maintenancedto.getDateFinPrevue()
        );
        maintenance.setDureeIntervention(duree);

        // Gestion du cas Ne_pas_repeter
        if (maintenancedto.getRepetitiontype() != repetitiontype.Ne_pas_repeter) {
            // Dans ce cas, on utilise startDaterep, endDaterep, selectedjours, selectedmois
            // Vérifier que les dates ne sont pas nulles avant de calculer la répétition
            if (maintenancedto.getStartDaterep() != null && maintenancedto.getEndDaterep() != null) {
                long repetition = calculerRepetition(
                    maintenancedto.getStartDaterep(),
                    maintenancedto.getEndDaterep(),
                    maintenancedto.getRepetitiontype()
                );
                maintenance.setRepetition(repetition);
            } else {
                // Par sécurité si dates absentes
                maintenance.setRepetition(0);
            }
        } else {
            // Pas de répétition
            maintenance.setRepetition(0);
            // On force à null ces champs qui ne doivent pas être envoyés
            maintenance.setStartDaterep(null);
            maintenance.setEndDaterep(null);
            //maintenance.setSelectedjours(null);
            //maintenance.setSelectedmois(null);
        }
        maintenance.setSkipRepetitionCalculation(false);
        // Sauvegarde en base
        Maintenance savedMaintenance = maintenanceRepository.save(maintenance);

        // Calcul et création des répétitions uniquement si répétition demandée
        if (maintenancedto.getRepetitiontype() != repetitiontype.Ne_pas_repeter
            && maintenancedto.getStartDaterep() != null
            && maintenancedto.getEndDaterep() != null) {

            List<LocalDate> repetitionDates = calculateRepetitionDates(
                toLocalDate(maintenancedto.getStartDaterep()),
                toLocalDate(maintenancedto.getEndDaterep()),
                maintenancedto.getRepetitiontype(),
                maintenancedto.getSelectedjours(),
                maintenancedto.getSelectedmois()
            );

            for (LocalDate date : repetitionDates) {
                RepetitionInstance instance = new RepetitionInstance();
                instance.setDateRepetition(date);
                instance.setStatut(savedMaintenance.getStatut());
                instance.setMaintenance(savedMaintenance);
                repetitionInstanceRepository.save(instance);
            }
        }
    }

    private LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    public String genererStatutsJsonParDefaut(String nextRepetitionDatesAsString) throws JsonProcessingException {
        System.out.println("DEBUG - génération JSON pour : " + nextRepetitionDatesAsString);
        Map<String, String> statuts = new HashMap<>();
        if (nextRepetitionDatesAsString != null && !nextRepetitionDatesAsString.isEmpty()) {
            String[] dates = nextRepetitionDatesAsString.split(",");
            for (String date : dates) {
                statuts.put(date.trim(), "EN_ATTENTE");
            }
        }
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(statuts);
        System.out.println("DEBUG - JSON généré = " + json);
        return json;
    }

    private long calculerDureeIntervention(LocalDate debut, LocalDate fin) {
        if (debut != null && fin != null) {
            return ChronoUnit.DAYS.between(debut, fin);
        }
        return 0;
    }
    
    public Date calculerDateRepetition(Date startDaterep, Date endDaterep, repetitiontype repetitiontype) {
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
                return null;
        }

        Date daterepetition = calendar.getTime();

        if (endDaterep != null && daterepetition.after(endDaterep)) {
            return null;
        }

        return daterepetition;
    }

    public Optional<Maintenance> findMaintenanceById(Long id) {
        return maintenanceRepository.findById(id);
    }

    public List<Maintenance> findAllMaintenances() {
        return maintenanceRepository.findAll();
    }

    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }
    


    @Transactional
    public MaintenanceDTO updateMaintenance(Long id, MaintenanceDTO maintenancedto) {
        Maintenance maintenance = maintenanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Maintenance non trouvée avec ID : " + id));

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
       
        long repetition = calculerRepetition(maintenancedto.getStartDaterep(), maintenancedto.getEndDaterep(), maintenancedto.getRepetitiontype());
        maintenance.setRepetition(repetition);

        long duree = calculerDureeIntervention(maintenancedto.getDateDebutPrevue(), maintenancedto.getDateFinPrevue());
        maintenance.setDureeIntervention(duree);
        maintenance.setSkipRepetitionCalculation(false);
        
        Equipement equipement = equipementRepository.findById(maintenancedto.getEquipementId())
            .orElseThrow(() -> new RuntimeException("Équipement non trouvé avec ID : " + maintenancedto.getEquipementId()));
        maintenance.setEquipement(equipement);

        Maintenance savedMaintenance = maintenanceRepository.save(maintenance);
        return new MaintenanceDTO(savedMaintenance);
    }

    private long calculerRepetition(Date start, Date end, repetitiontype type) {
        if (start == null || end == null || type == null) return 0;

        long diffMillis = end.getTime() - start.getTime();
        long jours = TimeUnit.MILLISECONDS.toDays(diffMillis);

        switch (type) {
            case TOUS_LES_JOURS:
                return jours + 1;
            case TOUS_LES_SEMAINES:
                return (jours / 7) + 1;
            case MENSUEL:
                return (jours / 30) + 1;
            case ANNUEL:
                return (jours / 365) + 1;
            case Ne_pas_repeter:
            default:
                return 0;
        }
    }

    public List<Maintenance> generateRepetitions(Maintenance parent) {
        if (parent.getNextRepetitionDates() == null || parent.getNextRepetitionDates().isEmpty()) {
            return Collections.emptyList();
        }

        List<Maintenance> repetitions = parent.getNextRepetitionDates().stream()
            .map(dateRep -> {
                Maintenance rep = new Maintenance();
                rep.setDateDebutPrevue(dateRep);
                rep.setDateFinPrevue(dateRep.plusDays(parent.getDureeIntervention()));
                rep.setTypeMaintenance(parent.getTypeMaintenance());
                rep.setPriorite(parent.getPriorite());
                rep.setStatut(Statut.EN_ATTENTE);
                rep.setCommentaires(parent.getCommentaires());
                rep.setRepetitiontype(parent.getRepetitiontype());
                rep.setDureeIntervention(parent.getDureeIntervention());
                rep.setEquipement(parent.getEquipement());
                rep.setResponsableMaintenance(parent.getResponsableMaintenance());
                rep.setUser(parent.getUser());
                rep.setFrequence(parent.getFrequence());
                rep.setService(parent.getService());
                rep.setAction(parent.getAction());
                return rep;
            })
            .map(maintenanceRepository::save)
            .collect(Collectors.toList());

        return repetitions;
    }

    private long calculerDureeRepetition(Date debut, Date fin) {
        if (debut != null && fin != null) {
            long diffInMillies = Math.abs(fin.getTime() - debut.getTime());
            return TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
        }
        return 0;
    }
    
    public List<Date> getRepetitionDates(Date startDaterep, Date endDaterep, repetitiontype repetitiontype) {
        if (startDaterep == null || endDaterep == null || repetitiontype == null) {
            return null;
        }

        List<Date> repetitionDates = new ArrayList<>();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDaterep);

        repetitionDates.add(calendar.getTime());

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
                    return repetitionDates;
            }

            if (!calendar.getTime().after(endDaterep)) {
                repetitionDates.add(calendar.getTime());
            }
        }

        return repetitionDates;
    }
    
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
                    e.printStackTrace();
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

    public Optional<LocalDate> startRepetition(Long id, LocalDate date) {
        Optional<Maintenance> optional = maintenanceRepository.findById(id);
        if (optional.isEmpty()) return Optional.empty();

        Maintenance maintenance = optional.get();

        List<LocalDate> dates = maintenance.getNextRepetitionDates();
        if (dates != null && dates.contains(date)) {
            return Optional.of(date);
        }

        return Optional.empty();
    }

    public List<MaintenanceDTO> getMaintenancesByTechnicien(Long userId) {
        return maintenanceRepository.findByAffecteAId(userId)
               .stream()
               .map(MaintenanceDTO::new)
               .collect(Collectors.toList());
    }

    public int getTechnicianWorkload(Long technicianId) {
        List<Maintenance> assignedTasks = maintenanceRepository.findByAffecteAIdAndStatutNotIn(technicianId, Arrays.asList(Statut.TERMINEE, Statut.ANNULEE));
        return assignedTasks.size();
    }

    public String verifierSeuilMaintenance(String nomIndice) {
        Optional<Indice> optIndice = indiceRepository.findByNomIndice(nomIndice);
        
        if (optIndice.isPresent()) {
            Indice indice = optIndice.get();

            Optional<AttributEquipements> optAttr = attributEquipementsRepository.findByNom(nomIndice);
            if (optAttr.isPresent()) {
                AttributEquipements attribut = optAttr.get();

                if (indice.getNomIndice().equals(attribut.getNom())) {
                    Optional<AttributEquipementValeur> optValeur = attributEquipementsValeursRepository.findByAttributEquipement(attribut);
                    if (optValeur.isPresent()) {
                        AttributEquipementValeur valeur = optValeur.get();

                        try {
                            double valeurDouble = Double.parseDouble(valeur.getValeur());
                            if (valeurDouble >= indice.getSeuilIndice()) {
                                return "⚠️ La maintenance doit être faite (valeur atteint ou dépasse le seuil).";
                            } else {
                                return "✅ La valeur n'a pas encore atteint le seuil.";
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
        Optional<Maintenance> existingMaintenanceOptional = maintenanceRepository.findById(maintenanceId);

        if (!existingMaintenanceOptional.isPresent()) {
            System.out.println("Erreur");
        }
        Maintenance maintenance = existingMaintenanceOptional.get();

        maintenance.setCommentaires(dto.getCommentaires() != null ? dto.getCommentaires() : maintenance.getCommentaires());
        maintenance.setDateDebutPrevue(dto.getDateDebutPrevue() != null ? dto.getDateDebutPrevue() : maintenance.getDateDebutPrevue());

        if (dto.getEquipementId() != null) {
            Optional<Equipement> equipementOptional = equipementRepository.findById(dto.getEquipementId());
            equipementOptional.ifPresent(maintenance::setEquipement);
        }

        maintenance = maintenanceRepository.save(maintenance);

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

        return new MaintenanceDTO(maintenance);
    }

    public Maintenance markAsCompleted(Long id) {
        Optional<Maintenance> maintenanceOpt = maintenanceRepository.findById(id);
        if (maintenanceOpt.isPresent()) {
            Maintenance maintenance = maintenanceOpt.get();
            if (maintenance.getStatut().equals(Statut.EN_COURS)) {
                maintenance.setStatut(Statut.TERMINEE);
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

    private List<LocalDate> calculateRepetitionDates(
        LocalDate start,
        LocalDate end,
        repetitiontype repetitiontype,
        List<String> selectedjours,
        List<String> selectedmois) {
            
        List<LocalDate> result = new ArrayList<>();
        if (start == null || repetitiontype == null) {
            return result;
        }
        
        List<String> joursList = selectedjours != null ? 
            selectedjours.stream()
                         .map(String::trim)
                         .map(String::toUpperCase)
                         .collect(Collectors.toList()) : 
            Collections.emptyList();

        List<String> moisList = selectedmois != null ? 
            selectedmois.stream()
                        .map(String::trim)
                        .map(String::toUpperCase)
                        .collect(Collectors.toList()) : 
            Collections.emptyList();

        LocalDate current = start;
        
        switch (repetitiontype) {
            case TOUS_LES_JOURS:
                while (end == null || !current.isAfter(end)) {
                    result.add(current);
                    current = current.plusDays(1);
                }
                break;
                
            case TOUS_LES_SEMAINES:
                while (end == null || !current.isAfter(end)) {
                    String jourSemaine = convertDayToFrench(current.getDayOfWeek());
                    if (joursList.contains(jourSemaine)) {
                        result.add(current);
                    }
                    current = current.plusDays(1);
                }
                break;
                
            case MENSUEL:
                while (end == null || !current.isAfter(end)) {
                    String mois = convertMonthToFrench(current.getMonth());
                    if (moisList.contains(mois)) {
                        result.add(current);
                    }
                    current = current.plusMonths(1);
                }
                break;
                
            case ANNUEL:
                while (end == null || !current.isAfter(end)) {
                    result.add(current);
                    current = current.plusYears(1);
                }
                break;
                
            case Ne_pas_repeter:
            default:
                result.add(start);
                break;
        }
        
        return result;
    }

    private String convertDayToFrench(DayOfWeek day) {
        switch (day) {
            case MONDAY:    return "LUNDI";
            case TUESDAY:   return "MARDI";
            case WEDNESDAY: return "MERCREDI";
            case THURSDAY:  return "JEUDI";
            case FRIDAY:    return "VENDREDI";
            case SATURDAY:  return "SAMEDI";
            case SUNDAY:    return "DIMANCHE";
            default:        return "";
        }
    }

    private String convertMonthToFrench(Month month) {
        switch (month) {
            case JANUARY:   return "JANVIER";
            case FEBRUARY:  return "FÉVRIER";
            case MARCH:     return "MARS";
            case APRIL:    return "AVRIL";
            case MAY:      return "MAI";
            case JUNE:     return "JUIN";
            case JULY:     return "JUILLET";
            case AUGUST:   return "AOÛT";
            case SEPTEMBER: return "SEPTEMBRE";
            case OCTOBER:  return "OCTOBRE";
            case NOVEMBER: return "NOVEMBRE";
            case DECEMBER: return "DÉCEMBRE";
            default:       return "";
        }
    }
    
}