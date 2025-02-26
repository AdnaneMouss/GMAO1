package com.huir.GmaoApp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.dto.MaintenanceDTO;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.repository.MaintenanceRepository;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    // Convertir un DTO en entité
    public Maintenance convertToEntity(MaintenanceDTO maintenanceDTO) {
        return new Maintenance(
        		maintenanceDTO.getId(), maintenanceDTO.getEquipement(), maintenanceDTO.getDepartement(),
                maintenanceDTO.getPersonneResponsable(), maintenanceDTO.getFrequence(),
                maintenanceDTO.getDateIntervention(), maintenanceDTO.getDureeEstimee(),
                maintenanceDTO.getUniteDuree(), maintenanceDTO.getPiecesRechange(),
                maintenanceDTO.getQuantitePieces(), maintenanceDTO.getLocalisation(),
                maintenanceDTO.getStatut(), maintenanceDTO.getImageEquipement()
        );
    }

    // Convertir une entité en DTO
    public MaintenanceDTO convertToDTO(Maintenance maintenance) {
        MaintenanceDTO dto = new MaintenanceDTO();
        dto.setId(maintenance.getId());
        dto.setEquipement(maintenance.getEquipement());
        dto.setDepartement(maintenance.getDepartement());
        dto.setPersonneResponsable(maintenance.getPersonneResponsable());
        dto.setFrequence(maintenance.getFrequence());
        dto.setDateIntervention(maintenance.getDateIntervention());
        dto.setDureeEstimee(maintenance.getDureeEstimee());
        dto.setUniteDuree(maintenance.getUniteDuree());
        dto.setPiecesRechange(maintenance.getPiecesRechange());
        dto.setQuantitePieces(maintenance.getQuantitePieces());
        dto.setLocalisation(maintenance.getLocalisation());
        dto.setStatut(maintenance.getStatut());
      dto.setImageEquipement(maintenance.getImageEquipement());
        return dto;
    }

    // Récupérer toutes les maintenances
    public List<Maintenance> getAllMaintenances() {
        return maintenanceRepository.findAll();
    }

    // Ajouter une maintenance
    public Maintenance addMaintenance(MaintenanceDTO maintenanceDTO) {
        Maintenance maintenance = convertToEntity(maintenanceDTO);
        return maintenanceRepository.save(maintenance);
    }

    // Récupérer une maintenance par ID
    public Optional<Maintenance> getMaintenanceById1(Long id) {
        return maintenanceRepository.findById(id);
    }
    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id).orElse(null); // Trouve la maintenance par ID
    }

    public Maintenance updateMaintenance(Maintenance maintenance) {
        return maintenanceRepository.save(maintenance); // Sauvegarde la maintenance mise à jour
    }


    // Supprimer une maintenance
    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }
}