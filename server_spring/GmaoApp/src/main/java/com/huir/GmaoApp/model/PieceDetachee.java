package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "pieces_detachees", uniqueConstraints = {
        @UniqueConstraint(columnNames = "reference")
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
    @NotBlank(message = "La référence ne peut pas être vide")
    private String reference;  // Référence spécifique de la pièce

    @Column(nullable = false)
    private String fournisseur;  // Fournisseur de la pièce


    @Column(nullable = false)
    private int quantiteMinimale;  // Quantité minimale à maintenir en stock

    private String image;  // Image (peut être un URL ou chemin de fichier)

    @OneToMany(mappedBy = "pieceDetachee", cascade = CascadeType.ALL)
    @JsonBackReference(value = "intervention-piece")
    private List<InterventionPieceDetachee> interventionPieces;


    @OneToMany(mappedBy = "piece", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference("piece-ligne")
    @JsonIgnore
    private List<LigneInventaire> lignesInventaire;

	@OneToMany(mappedBy = "pieceDetachee", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnoreProperties("pieceDetachee")
	private List<AchatPiece> achats;

    @Column(name = "quantite_stock")
    private int quantiteStock;  // Transient field for temporary stock calculation

    @Transient
    public String getStatut() {
        int quantiteStock = getQuantiteStock();  // Dynamically calculate stock quantity
        if (quantiteStock == 0) return "Rupture";
        if (quantiteStock < quantiteMinimale) return "Stock bas";
        return "Disponible";
    }
}
