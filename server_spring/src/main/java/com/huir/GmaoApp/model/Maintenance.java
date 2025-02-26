package com.huir.GmaoApp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Maintenance {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String equipement;
    private String departement;
    private String personneResponsable;
    private String frequence;
    private Date dateIntervention;
    private Integer dureeEstimee;
    private String uniteDuree;
    private String piecesRechange;
    private Integer quantitePieces;
    private String localisation;
    private String statut;

   // @Lob
    private String imageEquipement;  

  
}
