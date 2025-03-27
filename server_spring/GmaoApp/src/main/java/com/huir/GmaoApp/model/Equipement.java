package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;
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
    private String statut;
    private boolean actif;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM/dd/yyyy")
    private LocalDate dateAchat;
    private LocalDate dateMiseEnService;
    private String garantie;
    private LocalDate dateDerniereMaintenance;
    private String frequenceMaintenance;
    private String historiquePannes;
    private Double coutAchat;

    // Relation avec TypesEquipements (Chaque équipement appartient à un type)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_equipement_id")
    private TypesEquipements typeEquipement;

    // Relation avec les attributs et leurs valeurs
    @OneToMany(mappedBy = "equipement", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttributEquipementValeur> attributsValeurs;

    // Relation avec le service auquel appartient l’équipement
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private Services service;

    // Relation avec le responsable de maintenance
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private User responsableMaintenance;

    // Relation avec les pièces détachées associées à l’équipement
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "equipement_piece_detachee",
            joinColumns = @JoinColumn(name = "equipement_id"),
            inverseJoinColumns = @JoinColumn(name = "piece_detachee_id")
    )
    @JsonManagedReference
    private List<PieceDetachee> piecesDetachees;

    // Relationship with Salle (Each equipment is in a room)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "salle_id")
    private Salle salle;

    // Relationship with Etage (Each room is in a floor)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etage_id")
    private Etage etage;

    // Relationship with Batiment (Each floor is in a building)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;


    @JsonManagedReference
    @OneToMany(mappedBy = "equipement", fetch = FetchType.LAZY)
    private List<MaintenanceCorrective> maintenanceCorrectives;

}
