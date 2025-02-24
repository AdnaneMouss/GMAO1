package com.huir.GmaoApp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "pieces_detachees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PieceDetachee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String reference;  // Référence spécifique de la pièce

    @Column(nullable = false)
    private String fournisseur;  // Fournisseur de la pièce

    @Column(nullable = false)
    private double coutUnitaire;  // Coût d'une pièce détachée

    @Column(nullable = false)
    private int quantiteStock;  // Quantité disponible en stock

    @Column(nullable = false)
    private int quantiteMinimale;  // Quantité minimale à maintenir en stock

    private String dateAchat;  // Date d'achat de la pièce détachée

    private String datePeremption;  // Date de péremption pour certaines pièces (si applicable)

    private String historiqueUtilisation;  // Historique des utilisations de la pièce

    @ManyToMany(mappedBy = "piecesDetachees", fetch = FetchType.EAGER)
    private List<Equipement> equipements;

    @ManyToMany
    @JoinTable(
            name = "intervention_pieces",
            joinColumns = @JoinColumn(name = "piece_id"),
            inverseJoinColumns = @JoinColumn(name = "intervention_id")
    )
    private List<Intervention> interventions;
}
