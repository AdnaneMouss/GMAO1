package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.model.Intervention;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceCorrectiveDTO {
    private Long id;
    private String titre;
    private String description;
    private String statut;
    private String priorite;
    private LocalDateTime dateCreation;
    private LocalDateTime dateDemande;
    private LocalDateTime dateCloture;
    private LocalDateTime dateCommencement;
    private String creeParNom;
    private String affecteANom;
    private String demandeeParNom;
    private Long affecteAId;
    private Long creeParId;
    private Long demandeeParId;
    private String equipementNom;
    private String equipementNumSerie;
    private String equipementBatiment;
    private Integer equipementSalle;
    private Integer equipementEtage;
    private List<InterventionDTO> interventions;

    public MaintenanceCorrectiveDTO(MaintenanceCorrective maintenance) {
        this.id = maintenance.getId();
        this.titre = maintenance.getTitre();
        this.description = maintenance.getDescription();
        this.statut = maintenance.getStatut().name();
        this.priorite = maintenance.getPriorite().name();
        this.dateCreation = maintenance.getDateCreation();
        this.dateDemande=maintenance.getDateDemande();
        this.dateCloture = maintenance.getDateCloture();
        this.dateCommencement = maintenance.getDateCommencement();
        this.creeParNom = maintenance.getCreePar() != null ? maintenance.getCreePar().getNom() : null;
        this.affecteANom = maintenance.getAffecteA() != null ? maintenance.getAffecteA().getNom() : null;
        this.demandeeParNom = maintenance.getDemandeePar() != null ? maintenance.getDemandeePar().getNom() : null;
        this.affecteAId = maintenance.getAffecteA() != null ? maintenance.getAffecteA().getId() : null;
        this.creeParId = maintenance.getCreePar() != null ? maintenance.getCreePar().getId() : null;
        this.demandeeParId = maintenance.getDemandeePar() != null ? maintenance.getDemandeePar().getId() : null;
        this.equipementNom = maintenance.getEquipement() != null ? maintenance.getEquipement().getNom() : null;
        this.equipementNumSerie = maintenance.getEquipement() != null ? maintenance.getEquipement().getNumeroSerie() : null;
        this.interventions = maintenance.getInterventions() != null
                ? maintenance.getInterventions().stream()
                .map(InterventionDTO::new)
                .collect(Collectors.toList())
                : null;

        Equipement equipement = maintenance.getEquipement();
        if (equipement != null) {
            this.equipementNom = equipement.getNom();
            this.equipementBatiment = equipement.getBatiment() != null ? equipement.getBatiment().getIntitule() : null;
            this.equipementEtage = equipement.getEtage() != null ? equipement.getEtage().getNum() : null;
            this.equipementSalle = equipement.getSalle() != null ? equipement.getSalle().getNum() : null;
        } else {
            this.equipementNom = null;
            this.equipementBatiment = null;
            this.equipementEtage = null;
            this.equipementSalle = null;
        }

    }
}  

