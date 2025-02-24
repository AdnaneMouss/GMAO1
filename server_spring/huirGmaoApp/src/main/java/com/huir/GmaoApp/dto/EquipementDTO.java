package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Equipement;
import lombok.*;

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
    private String localisation;
    private String serviceNom;
    private String statut;
    private String dateAchat;
    private String dateMiseEnService;
    private String garantie;
    private String dateDerniereMaintenance;
    private String frequenceMaintenance;
    private String responsableMaintenanceNom;
    private List<String> ordresTravail;
    private List<String> piecesDetachees;
    private String historiquePannes;
    private String coutAchat;

    // Add the list of dynamic attributes
    private List<AttributDTO> attributs;

    // Constructor to map Equipement to EquipementDTO
    public EquipementDTO(Equipement equipement) {
        this.id = equipement.getId();
        this.nom = equipement.getNom();
        this.description = equipement.getDescription();
        this.numeroSerie = equipement.getNumeroSerie();
        this.modele = equipement.getModele();
        this.marque = equipement.getMarque();
        this.localisation = equipement.getLocalisation();
        this.statut = equipement.getStatut();
        this.dateAchat = equipement.getDateAchat();
        this.dateMiseEnService = equipement.getDateMiseEnService();
        this.garantie = equipement.getGarantie();
        this.dateDerniereMaintenance = equipement.getDateDerniereMaintenance();
        this.frequenceMaintenance = equipement.getFrequenceMaintenance();
        this.historiquePannes = equipement.getHistoriquePannes();
        this.coutAchat = equipement.getCoutAchat();
        this.image = equipement.getImage();
        this.serviceNom = equipement.getService() != null ? equipement.getService().getNom() : null;
        this.responsableMaintenanceNom = equipement.getResponsableMaintenance() != null ? equipement.getResponsableMaintenance().getNom() : null;

        // Map the list of ordresTravail and piecesDetachees
        this.ordresTravail = equipement.getOrdresTravail() != null ? equipement.getOrdresTravail().stream()
                .map(ordre -> ordre.getDescription())  // assuming OrdreTravail has a "description" field
                .collect(Collectors.toList()) : null;

        this.piecesDetachees = equipement.getPiecesDetachees() != null ? equipement.getPiecesDetachees().stream()
                .map(piece -> piece.getNom())  // assuming PieceDetachee has a "nom" field
                .collect(Collectors.toList()) : null;

        // Map dynamic attributes to DTOs
        this.attributs = equipement.getAttributs() != null ? equipement.getAttributs().stream()
                .map(attr -> new AttributDTO(attr.getNom(), attr.getValeur()))
                .collect(Collectors.toList()) : null;
    }
}
