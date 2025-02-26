package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import jakarta.persistence.*;
import java.util.List;@Entity
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
    private String localisation;
    private String statut;
    private String dateAchat;
    private String dateMiseEnService;
    private String garantie;
    private String dateDerniereMaintenance;
    private String frequenceMaintenance;
    private String historiquePannes;
    private String coutAchat;

    // Relationship with Service
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private Services service;

    // Relationship with ResponsableMaintenance
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    private User responsableMaintenance;

    // Relationship with OrdreTravail
    @OneToMany(mappedBy = "equipement", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrdreTravail> ordresTravail;

    // Relationship with PieceDetachee (Many-to-Many)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "equipement_piece_detachee",
            joinColumns = @JoinColumn(name = "equipement_id"),
            inverseJoinColumns = @JoinColumn(name = "piece_detachee_id")
    )
    @JsonManagedReference
    private List<PieceDetachee> piecesDetachees;

    // Relationship with Attribut (One-to-Many)
    @OneToMany(mappedBy = "equipement", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Attribut> attributs;
}
