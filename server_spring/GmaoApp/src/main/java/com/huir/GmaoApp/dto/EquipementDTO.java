package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Equipement;
import lombok.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipementDTO {
    private Long id;
    private String image;
    private String nom;
    private String description;
    private String numeroSerie;
    private String modele;
    private String marque;
    private String statut;
    private String serviceNom;
    private LocalDate dateAchat;
    private LocalDate dateMiseEnService;
    private String garantie;
    private LocalDate dateDerniereMaintenance;
    private String frequenceMaintenance;
    private String responsableMaintenanceNom;
    private List<String> ordresTravail;
    private List<String> piecesDetachees;
    private String historiquePannes;
    private Double coutAchat;

    // Nouveaux champs ajoutés
    private String typeEquipement;
    private String codeBarre;
    private boolean actif;

    // Liste des attributs dynamiques
    private List<AttributEquipementValeurDTO> attributs;

    // Champs pour les relations Batiment, Etage et Salle
    private String batimentNom;
    private Integer etageNum;
    private Integer salleNum;

    // Constructor to map Equipement to EquipementDTO
    public EquipementDTO(Equipement equipement) {
        this.id = equipement.getId();
        this.nom = equipement.getNom();
        this.description = equipement.getDescription();
        this.numeroSerie = equipement.getNumeroSerie();
        this.modele = equipement.getModele();
        this.marque = equipement.getMarque();
        this.statut = equipement.getStatut();
        this.dateAchat = equipement.getDateAchat();
        this.dateMiseEnService = equipement.getDateMiseEnService();
        this.garantie = equipement.getGarantie();
        this.dateDerniereMaintenance = equipement.getDateDerniereMaintenance();
        this.frequenceMaintenance = equipement.getFrequenceMaintenance();
        this.historiquePannes = equipement.getHistoriquePannes();
        this.coutAchat = equipement.getCoutAchat();
        this.image = equipement.getImage();
        this.actif = equipement.isActif();
        this.typeEquipement = equipement.getTypeEquipement() != null ? equipement.getTypeEquipement().getType() : null;

        // Map the service and responsible maintenance details
        this.serviceNom = equipement.getService() != null ? equipement.getService().getNom() : null;
        this.responsableMaintenanceNom = equipement.getResponsableMaintenance() != null
                ? equipement.getResponsableMaintenance().getNom()
                : null;

        // Map the list of ordresTravail and piecesDetachees
        this.ordresTravail = equipement.getOrdresTravail() != null ? equipement.getOrdresTravail().stream()
                .map(ordre -> ordre.getDescription()) // assuming OrdreTravail has a "description" field
                .collect(Collectors.toList()) : Collections.emptyList();

        this.piecesDetachees = equipement.getPiecesDetachees() != null ? equipement.getPiecesDetachees().stream()
                .map(piece -> piece.getNom()) // assuming PieceDetachee has a "nom" field
                .collect(Collectors.toList()) : Collections.emptyList();

        // Mapping des attributs dynamiques
        this.attributs = equipement.getAttributsValeurs() != null ? equipement.getAttributsValeurs().stream()
                .map(AttributEquipementValeurDTO::new)
                .collect(Collectors.toList()) : Collections.emptyList();

// Assuming equipement.getEtage().getBatiment() is how you access the associated building (Batiment)
        this.batimentNom = equipement.getBatiment() != null ? equipement.getBatiment().getIntitule() : null;
        this.etageNum = equipement.getEtage() != null ? equipement.getEtage().getNum() : null;
        this.salleNum = equipement.getSalle() != null ? equipement.getSalle().getNum() : null;

    }
}
