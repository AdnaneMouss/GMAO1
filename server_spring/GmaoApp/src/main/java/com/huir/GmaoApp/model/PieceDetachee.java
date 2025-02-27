package com.huir.GmaoApp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pieces_detachees", uniqueConstraints = {
        @UniqueConstraint(columnNames = "reference"),
        
})
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

    @Column(nullable = false, unique = true)
    @NotBlank(message = "La reference ne peut pas être vide")
    private String reference;  // Référence spécifique de la pièce

    @Column(nullable = false)
    private String fournisseur;  // Fournisseur de la pièce

    @Column(nullable = false)
    private double coutUnitaire;  // Coût d'une pièce détachée

    @Column(nullable = false)
    private int quantiteStock;  // Quantité disponible en stock

    @Column
    private String image;  // Image


    @Column(nullable = false)
    private int quantiteMinimale;  // Quantité minimale à maintenir en stock

    private String dateAchat;  // Date d'achat de la pièce détachée

    private String datePeremption;  // Date de péremption pour certaines pièces (si applicable)

    private String historiqueUtilisation;  // Historique des utilisations de la pièce

    @ManyToMany(mappedBy = "piecesDetachees", fetch = FetchType.EAGER)
    private List<Equipement> equipements;
    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "intervention_pieces",
            joinColumns = @JoinColumn(name = "piece_id"),
            inverseJoinColumns = @JoinColumn(name = "intervention_id")
    )
    
    private List<Intervention> interventions;
}
