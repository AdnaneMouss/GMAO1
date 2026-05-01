package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.dto.MaintenanceCorrectiveDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.MaintenanceCorrectiveRepository;
import com.huir.GmaoApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceCorrectiveService {

    private final MaintenanceCorrectiveRepository maintenanceCorrectiveRepository;
    private final EquipementRepository equipementRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;


    public MaintenanceCorrective startTask(Long id) {
        Optional<MaintenanceCorrective> maintenanceOpt = maintenanceCorrectiveRepository.findById(id);
        if (maintenanceOpt.isPresent()) {
            MaintenanceCorrective maintenance = maintenanceOpt.get();
            if (maintenance.getStatut() == Statut.EN_ATTENTE) {
                maintenance.setStatut(Statut.EN_COURS);
                return maintenanceCorrectiveRepository.save(maintenance);
            }
        }
        return null;
    }

    public MaintenanceCorrective cancelTask(Long id) {
        Optional<MaintenanceCorrective> maintenanceOpt = maintenanceCorrectiveRepository.findById(id);
        if (maintenanceOpt.isPresent()) {
            MaintenanceCorrective maintenance = maintenanceOpt.get();
            if (maintenance.getStatut() == Statut.EN_ATTENTE || maintenance.getStatut() == Statut.DEMANDEE) {
                maintenance.setStatut(Statut.ANNULEE);
                return maintenanceCorrectiveRepository.save(maintenance);
            }
        }
        return null;
    }

    public MaintenanceCorrective approveTask(Long id, Long affecteAId, Long creeParId) {
        Optional<MaintenanceCorrective> maintenanceOpt = maintenanceCorrectiveRepository.findById(id);
        if (maintenanceOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Maintenance introuvable avec l'ID : " + id);
        }

        MaintenanceCorrective maintenance = maintenanceOpt.get();

        if (maintenance.getStatut() != Statut.DEMANDEE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seules les maintenances en statut DEMANDEE peuvent être approuvées.");
        }

        Equipement equipement = maintenance.getEquipement();
        if (equipement == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L’équipement associé est manquant.");
        }

        // 🔥 Check if the equipement is already under active maintenance
        boolean isAlreadyUnderMaintenance = maintenanceCorrectiveRepository
                .existsByEquipementAndStatutIn(equipement, List.of(Statut.EN_ATTENTE, Statut.EN_COURS));

        if (isAlreadyUnderMaintenance) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "L’équipement \"" + equipement.getNom() + "\" est déjà sous maintenance.");
        }

        // 💡 Assign technician if provided
        if (affecteAId != null) {
            userRepository.findById(affecteAId)
                    .ifPresentOrElse(
                            maintenance::setAffecteA,
                            () -> { throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Technicien non trouvé"); }
                    );
        }

        // 🧑‍💼 Assign creator (approver)
        if (creeParId != null) {
            userRepository.findById(creeParId)
                    .ifPresentOrElse(
                            maintenance::setCreePar,
                            () -> { throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Créateur non trouvé"); }
                    );
        }

        // ✅ Set status and creation date
        maintenance.setStatut(Statut.EN_ATTENTE);
        maintenance.setDateCreation(LocalDateTime.now());

        // 💾 Save and return
        return maintenanceCorrectiveRepository.save(maintenance);
    }




    public MaintenanceCorrective markAsCompleted(Long id) {
        Optional<MaintenanceCorrective> maintenanceOpt = maintenanceCorrectiveRepository.findById(id);
        if (maintenanceOpt.isPresent()) {
            MaintenanceCorrective maintenance = maintenanceOpt.get();
            if (maintenance.getStatut() == Statut.EN_COURS) {
                maintenance.setStatut(Statut.TERMINEE);
                return maintenanceCorrectiveRepository.save(maintenance);
            }
        }
        return null;
    }


    public List<MaintenanceCorrectiveDTO> getMaintenancesByTechnicien(Long technicienId) {
        return maintenanceCorrectiveRepository.findByAffecteAId(technicienId).stream()
                .map(MaintenanceCorrectiveDTO::new)
                .collect(Collectors.toList());
    }


    public MaintenanceCorrectiveDTO createMaintenanceCorrective(MaintenanceCorrectiveDTO dto) {
        MaintenanceCorrective maintenance = new MaintenanceCorrective();
        maintenance.setTitre(dto.getTitre());
        maintenance.setDescription(dto.getDescription());
        maintenance.setStatut(dto.getStatut() != null ? Statut.valueOf(dto.getStatut()) : Statut.EN_ATTENTE);
        maintenance.setPriorite(dto.getPriorite() != null ? Priorite.valueOf(dto.getPriorite()) : Priorite.NORMALE);
        maintenance.setDateCreation(dto.getDateCreation() != null ? dto.getDateCreation() : LocalDateTime.now());

        // Vérifier si l'équipement existe avant de l'affecter
        if (dto.getEquipementNom() != null) {
            Optional<Equipement> equipementOptional = equipementRepository.findByNom(dto.getEquipementNom());

            if (equipementOptional.isPresent()) {
                Equipement equipement = equipementOptional.get();

                // 🔥 Check if already under active maintenance
                boolean isAlreadyUnderMaintenance = maintenanceCorrectiveRepository
                        .existsByEquipementAndStatutIn(equipement, List.of(Statut.EN_ATTENTE, Statut.EN_COURS));

                if (isAlreadyUnderMaintenance) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "L’équipement \"" + equipement.getNom() + "\" est déjà sous maintenance.");
                }

                maintenance.setEquipement(equipement);
            }
        }

        // Vérifier si le technicien existe avant de l'affecter
        if (dto.getAffecteAId() != null) {
            Optional<User> technicienOptional = userRepository.findById(dto.getAffecteAId());
            technicienOptional.ifPresent(maintenance::setAffecteA);
        }

        if (dto.getCreeParId() != null) {
            Optional<User> creatorOptional = userRepository.findById(dto.getCreeParId());
            creatorOptional.ifPresent(maintenance::setCreePar);
        }

        // Save the maintenance
        maintenance = maintenanceCorrectiveRepository.save(maintenance);

        // Send email if assigned
        if (maintenance.getAffecteA() != null && maintenance.getAffecteA().getEmail() != null) {
            String subject = "Nouvelle maintenance corrective assignée";
            String body = "Bonjour " + maintenance.getAffecteA().getNom() + ",\n\n"
                    + "Une nouvelle maintenance corrective vous a été assignée.\n\n"
                    + "Titre: " + maintenance.getTitre() + "\n"
                    + "Description: " + maintenance.getDescription() + "\n"
                    + "Priorité: " + maintenance.getPriorite() + "\n\n"
                    + "Merci de bien vouloir la traiter dans les plus brefs délais.\n\n"
                    + "Cordialement,\nL'équipe GMAO";

            emailService.sendEmail(maintenance.getAffecteA().getEmail(), subject, body);
        }

        return new MaintenanceCorrectiveDTO(maintenance);
    }

    public MaintenanceCorrectiveDTO demanderMaintenanceCorrective(MaintenanceCorrectiveDTO dto) {
        MaintenanceCorrective maintenance = new MaintenanceCorrective();
        LocalDateTime now = LocalDateTime.now();

        // Set basic fields
        maintenance.setTitre(dto.getTitre());
        maintenance.setDescription(dto.getDescription());
        maintenance.setStatut(Statut.DEMANDEE);
        maintenance.setPriorite(dto.getPriorite() != null ? Priorite.valueOf(dto.getPriorite()) : Priorite.NORMALE);
        maintenance.setDateDemande(now);

        // Equipement validation and conflict check
        if (dto.getEquipementNom() != null) {
            Optional<Equipement> equipementOptional = equipementRepository.findByNom(dto.getEquipementNom());

            if (equipementOptional.isPresent()) {
                Equipement equipement = equipementOptional.get();

                boolean isAlreadyUnderMaintenance = maintenanceCorrectiveRepository
                        .existsByEquipementAndStatutIn(equipement, List.of(Statut.EN_ATTENTE, Statut.EN_COURS));

                if (isAlreadyUnderMaintenance) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "L’équipement \"" + equipement.getNom() + "\" est déjà sous maintenance.");
                }

                maintenance.setEquipement(equipement);
            }
        }

        // Set creator (the doctor)
        if (dto.getDemandeeParId() != null) {
            userRepository.findById(dto.getDemandeeParId()).ifPresent(maintenance::setDemandeePar);
        }

        // Save the maintenance
        maintenance = maintenanceCorrectiveRepository.save(maintenance);

        // Notify all users with the RESPONSABLE role
        List<User> responsables = userRepository.findByRole(Role.RESPONSABLE);

        String doctorName = maintenance.getCreePar() != null ? maintenance.getCreePar().getNom() : "Un utilisateur";
        String doctorPrefix = maintenance.getCreePar() != null ? maintenance.getCreePar().getNom() : "Un utilisateur";
        String subject = "Nouvelle demande de maintenance corrective";
        String body = "Bonjour,\n\n"
        +doctorPrefix + doctorName + " a demandé une maintenance corrective pour l’équipement suivant :\n\n"
                + "Titre : " + maintenance.getTitre() + "\n"
                + "Description : " + maintenance.getDescription() + "\n"
                + "Priorité : " + maintenance.getPriorite() + "\n\n"
                + "Merci de prendre en charge cette demande dès que possible.\n\n"
                + "Cordialement,\nL’équipe GMAO";

        for (User responsable : responsables) {
            if (responsable.getEmail() != null) {
                emailService.sendEmail(responsable.getEmail(), subject, body);
            }
        }

        return new MaintenanceCorrectiveDTO(maintenance);
    }


    public MaintenanceCorrectiveDTO updateMaintenanceCorrective(Long maintenanceId, MaintenanceCorrectiveDTO dto) {
        Optional<MaintenanceCorrective> existingMaintenanceOptional = maintenanceCorrectiveRepository.findById(maintenanceId);

        if (!existingMaintenanceOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Maintenance non trouvée avec l'ID : " + maintenanceId);
        }

        MaintenanceCorrective maintenance = existingMaintenanceOptional.get();

        // 🔍 Check for conflict if equipement is being changed
        if (dto.getEquipementNom() != null) {
            Optional<Equipement> equipementOptional = equipementRepository.findByNom(dto.getEquipementNom());

            if (equipementOptional.isPresent()) {
                Equipement equipement = equipementOptional.get();

                // Check if another maintenance is already active for this equipment
                boolean isUnderMaintenance = maintenanceCorrectiveRepository
                        .existsByEquipementAndStatutInAndIdNot(equipement, List.of(Statut.EN_ATTENTE, Statut.EN_COURS), maintenanceId);

                if (isUnderMaintenance) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "L’équipement \"" + equipement.getNom() + "\" est déjà sous maintenance.");
                }

                maintenance.setEquipement(equipement);
            }
        }

        // Update fields
        maintenance.setTitre(dto.getTitre() != null ? dto.getTitre() : maintenance.getTitre());
        maintenance.setDescription(dto.getDescription() != null ? dto.getDescription() : maintenance.getDescription());
        maintenance.setStatut(dto.getStatut() != null ? Statut.valueOf(dto.getStatut()) : maintenance.getStatut());
        maintenance.setPriorite(dto.getPriorite() != null ? Priorite.valueOf(dto.getPriorite()) : maintenance.getPriorite());
        maintenance.setDateCreation(dto.getDateCreation() != null ? dto.getDateCreation() : maintenance.getDateCreation());

        // Update technician if provided
        if (dto.getAffecteAId() != null) {
            userRepository.findById(dto.getAffecteAId()).ifPresent(maintenance::setAffecteA);
        }

        // Update creator if provided
        if (dto.getCreeParId() != null) {
            userRepository.findById(dto.getCreeParId()).ifPresent(maintenance::setCreePar);
        }

        maintenance = maintenanceCorrectiveRepository.save(maintenance);

        if (maintenance.getAffecteA() != null && maintenance.getAffecteA().getEmail() != null) {
            String subject = "Mise à jour de la maintenance corrective assignée";
            String body = "Bonjour " + maintenance.getAffecteA().getNom() + ",\n\n"
                    + "Une maintenance corrective a été mise à jour.\n\n"
                    + "Titre: " + maintenance.getTitre() + "\n"
                    + "Description: " + maintenance.getDescription() + "\n"
                    + "Priorité: " + maintenance.getPriorite() + "\n\n"
                    + "Merci de bien vouloir vérifier la mise à jour.\n\n"
                    + "Cordialement,\nL'équipe GMAO";


            emailService.sendEmail(maintenance.getAffecteA().getEmail(), subject, body);
        }

        return new MaintenanceCorrectiveDTO(maintenance);
    }

    public MaintenanceCorrectiveDTO updateMaintenanceCorrectiveLambda(Long maintenanceId, MaintenanceCorrectiveDTO dto) {
        Optional<MaintenanceCorrective> existingMaintenanceOptional = maintenanceCorrectiveRepository.findById(maintenanceId);

        if (!existingMaintenanceOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Maintenance non trouvée avec l'ID : " + maintenanceId);
        }

        MaintenanceCorrective maintenance = existingMaintenanceOptional.get();

        // 🔍 Check for conflict if equipement is being changed
        if (dto.getEquipementNom() != null) {
            Optional<Equipement> equipementOptional = equipementRepository.findByNom(dto.getEquipementNom());

            if (equipementOptional.isPresent()) {
                Equipement equipement = equipementOptional.get();

                // Check if another maintenance is already active for this equipment
                boolean isUnderMaintenance = maintenanceCorrectiveRepository
                        .existsByEquipementAndStatutInAndIdNot(equipement, List.of(Statut.EN_ATTENTE, Statut.EN_COURS), maintenanceId);

                if (isUnderMaintenance) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "L’équipement \"" + equipement.getNom() + "\" est déjà sous maintenance.");
                }

                maintenance.setEquipement(equipement);
            }
        }

        // Update fields
        maintenance.setTitre(dto.getTitre() != null ? dto.getTitre() : maintenance.getTitre());
        maintenance.setDescription(dto.getDescription() != null ? dto.getDescription() : maintenance.getDescription());
        maintenance.setStatut(dto.getStatut() != null ? Statut.valueOf(dto.getStatut()) : maintenance.getStatut());
        maintenance.setPriorite(dto.getPriorite() != null ? Priorite.valueOf(dto.getPriorite()) : maintenance.getPriorite());
        maintenance.setDateDemande(dto.getDateCreation() != null ? dto.getDateCreation() : maintenance.getDateCreation());

        // Update technician if provided
        if (dto.getDemandeeParId() != null) {
            userRepository.findById(dto.getDemandeeParId()).ifPresent(maintenance::setDemandeePar);
        }

        maintenance = maintenanceCorrectiveRepository.save(maintenance);
        List<User> responsables = userRepository.findByRole(Role.RESPONSABLE);

        if (maintenance.getDemandeePar() != null && maintenance.getAffecteA().getEmail() != null) {
            String subject = "Mise à jour de la maintenance corrective assignée";
            String body = "Bonjour,\n\n"
                    + "Une maintenance corrective a été mise à jour.\n\n"
                    + "Titre: " + maintenance.getTitre() + "\n"
                    + "Description: " + maintenance.getDescription() + "\n"
                    + "Priorité: " + maintenance.getPriorite() + "\n\n"
                    + "Merci de bien vouloir vérifier la mise à jour.\n\n"
                    + "Cordialement,\nL'équipe GMAO";

            for (User responsable : responsables) {
                if (responsable.getEmail() != null) {
                    emailService.sendEmail(responsable.getEmail(), subject, body);
                }
            }
        }

        return new MaintenanceCorrectiveDTO(maintenance);
    }



    // Récupérer une maintenance par ID
    public Optional<MaintenanceCorrective> getMaintenanceById(Long id) {
        return maintenanceCorrectiveRepository.findById(id);
    }

    public int getTechnicianWorkload(Long technicianId) {
        List<MaintenanceCorrective> assignedTasks = maintenanceCorrectiveRepository.findByAffecteAIdAndStatutNotIn(technicianId, Arrays.asList(Statut.TERMINEE, Statut.ANNULEE));
        return assignedTasks.size();
    }


    // Récupérer toutes les maintenances
    public List<MaintenanceCorrective> getAllMaintenances() {
        return maintenanceCorrectiveRepository.findAll();
    }



    // Supprimer une maintenance
    public void deleteMaintenance(Long id) {
        maintenanceCorrectiveRepository.deleteById(id);
    }
}
