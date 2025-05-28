package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.huir.GmaoApp.dto.MaintenanceDTO;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "equipements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String image;
    private String nom;
    private String description;
    private String numeroSerie;
    private String modele;
    private String marque;
    @Enumerated(EnumType.STRING)
    private StatutEquipement statut = StatutEquipement.EN_SERVICE;
    private boolean actif;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM/dd/yyyy")
    private LocalDate dateAchat;

    @Column(nullable = true, updatable = false)
    private LocalDateTime dateMiseEnService;

    private String garantie;
    private LocalDate dateDerniereMaintenance;
    private Double coutAchat;
    private String labelSuivi;  // Indicateur
    private double valeurSuivi; // Seuil

    // Relation avec TypesEquipements (Chaque équipement appartient à un type)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_equipement_id")
    private TypesEquipements typeEquipement;

    // Relation avec le service auquel appartient l’équipement
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference // Cette annotation empêche la boucle infinie avec Services
    private Services service;

    // Relation avec Salle (Chaque équipement est dans une salle)
	@JsonBackReference("salle-equipement")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "salle_id")
    private Salle salle;

    // Relation avec Etage (Chaque salle est dans un étage)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etage_id")
    private Etage etage;

    // Relation avec Batiment (Chaque étage est dans un bâtiment)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    // Maintenance corrective liée à cet équipement
    @JsonManagedReference
    @OneToMany(mappedBy = "equipement", fetch = FetchType.EAGER)
    private List<MaintenanceCorrective> maintenanceCorrectives;

    // Maintenance préventive et autres maintenances liées à cet équipement
    @JsonManagedReference
    @OneToMany(mappedBy = "equipement", fetch = FetchType.EAGER)
    private List<Maintenance> maintenances;


    
    
}
