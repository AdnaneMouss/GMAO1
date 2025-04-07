package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.dto.MaintenanceCorrectiveDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.MaintenanceCorrectiveRepository;
import com.huir.GmaoApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
            equipementOptional.ifPresent(maintenance::setEquipement);
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

        // Send an email to the technician if assigned
        if (maintenance.getAffecteA() != null && maintenance.getAffecteA().getEmail() != null) {
            String subject = "Nouvelle maintenance corrective assignée";
            String body = "Bonjour " + maintenance.getAffecteA().getNom() + ",\n\n"
                    + "Une nouvelle maintenance corrective vous a été assignée.\n\n"
                    + "Titre: " + maintenance.getTitre() + "\n"
                    + "Description: " + maintenance.getDescription() + "\n"
                    + "Priorité: " + maintenance.getPriorite() + "\n\n"
                    + "Merci de bien vouloir la traiter dans les plus brefs délais en cliquant sur lien ci-dessous.\n\n"
                    + "Cordialement,\nL'équipe GMAO";

            emailService.sendEmail(maintenance.getAffecteA().getEmail(), subject, body);
        }

        return new MaintenanceCorrectiveDTO(maintenance);
    }
    // Récupérer une maintenance par ID
    public Optional<MaintenanceCorrective> getMaintenanceById(Long id) {
        return maintenanceCorrectiveRepository.findById(id);
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
