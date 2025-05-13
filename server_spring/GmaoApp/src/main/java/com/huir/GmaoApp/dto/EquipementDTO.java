package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.StatutEquipement;
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
    private StatutEquipement statut;
    private String serviceNom;
    private LocalDate dateAchat;
    private LocalDate dateMiseEnService;
    private String garantie;
    private LocalDate dateDerniereMaintenance;
    private Double coutAchat;
    
    private String labelSuivi;  // Label suivi
    private double valeurSuivi; // Valeur suivie

    // Nouveaux champs ajoutés
    private String typeEquipement;
    private boolean actif;

    // Liste des attributs dynamiques
    private List<AttributEquipementValeurDTO> attributsValeurs;
    private List<AttributEquipements> attributsEquipement;
    

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
        this.garantie = equipement.getGarantie();
        this.dateDerniereMaintenance = equipement.getDateDerniereMaintenance();
        this.coutAchat = equipement.getCoutAchat();
        this.image = equipement.getImage();
        this.actif = equipement.isActif();
        this.typeEquipement = equipement.getTypeEquipement() != null ? equipement.getTypeEquipement().getType() : null;
        this.labelSuivi= equipement.getLabelSuivi();
        this.valeurSuivi=equipement.getValeurSuivi();
        // Map the service and responsible maintenance details
        this.serviceNom = equipement.getService() != null ? equipement.getService().getNom() : null;

        // Mapping des attributs dynamiques
        //this.attributs = equipement.getAttributsValeurs() != null ? equipement.getAttributsValeurs().stream()
          //      .map(AttributEquipementValeurDTO::new)
            //    .collect(Collectors.toList()) : Collections.emptyList();

// Assuming equipement.getEtage().getBatiment() is how you access the associated building (Batiment)
        this.batimentNom = equipement.getBatiment() != null ? equipement.getBatiment().getIntitule() : null;
        this.etageNum = equipement.getEtage() != null ? equipement.getEtage().getNum() : null;
        this.salleNum = equipement.getSalle() != null ? equipement.getSalle().getNum() : null;

    }


    
      
    
    
}
