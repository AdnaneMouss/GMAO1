package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.AttributEquipementValeur;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.StatutEquipement;
import com.huir.GmaoApp.repository.AttributEquipementsValeursRepository;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private StatutEquipement statut;
    private String serviceNom;
    private Long serviceId;
    private LocalDate dateAchat;
    private LocalDateTime dateMiseEnService;
    private String garantie;
    private LocalDate dateDerniereMaintenance;
    private Double coutAchat;

    private String labelSuivi;  // Label suivi
    private double valeurSuivi; // Valeur suivie

    // Nouveaux champs ajoutés
    private String typeEquipementNom;
    private Long typeEquipementId;
    private boolean actif;

    private AttributEquipementsValeursRepository attributEquipementsValeursRepository;

    // Liste des attributs dynamiques
    private List<AttributEquipementValeurDTO> attributsValeurs;


    // Champs pour les relations Batiment, Etage et Salle
    private String batimentNom;
    private Integer batimentNum;
    private Long batimentId;
    private Long etageId;
    private Long salleId;
    private Integer etageNum;
    private Integer salleNum;
    private String sallePrefixe;

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
        this.garantie = equipement.getGarantie();
        this.dateDerniereMaintenance = equipement.getDateDerniereMaintenance();
        this.dateMiseEnService = equipement.getDateMiseEnService();
        this.coutAchat = equipement.getCoutAchat();
        this.image = equipement.getImage();
        this.actif = equipement.isActif();
        this.typeEquipementNom = equipement.getTypeEquipement() != null ? equipement.getTypeEquipement().getType() : null;
        this.typeEquipementId = equipement.getTypeEquipement() != null ? equipement.getTypeEquipement().getId() : null;
        this.labelSuivi= equipement.getLabelSuivi();
        this.valeurSuivi=equipement.getValeurSuivi();
        // Map the service and responsible maintenance details
        this.serviceNom = equipement.getService() != null ? equipement.getService().getNom() : null;
        this.serviceId = equipement.getService() != null ? equipement.getService().getId() : null;



// Assuming equipement.getEtage().getBatiment() is how you access the associated building (Batiment)
        this.batimentNom = equipement.getBatiment() != null ? equipement.getBatiment().getIntitule() : null;
        this.batimentNum = equipement.getBatiment() != null ? equipement.getBatiment().getNumBatiment() : null;
        this.batimentId = equipement.getBatiment() != null ? equipement.getBatiment().getId() : null;
        this.etageNum = equipement.getEtage() != null ? equipement.getEtage().getNum() : null;
        this.etageId = equipement.getEtage() != null ? equipement.getEtage().getId() : null;
        this.salleNum = equipement.getSalle() != null ? equipement.getSalle().getNum() : null;
        this.salleId = equipement.getSalle() != null ? equipement.getSalle().getId() : null;
        this.sallePrefixe = equipement.getSalle() != null ? equipement.getSalle().getPrefixe() : null;



    }






}
