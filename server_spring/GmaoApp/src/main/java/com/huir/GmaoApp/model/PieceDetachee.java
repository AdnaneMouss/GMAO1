package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    private double coutUnitaire;  // Coût d'une pièce détachée

    @Column(nullable = false)
    private int quantiteStock;  // Quantité disponible en stock

    @Column(nullable = false)
    private int quantiteMinimale;  // Quantité minimale à maintenir en stock

    private String image;  // Image (peut être un URL ou chemin de fichier)

    private LocalDate dateAchat;  // Date d'achat de la pièce détachée

    private LocalDate datePeremption;  // Date de péremption pour certaines pièces (si applicable)

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> historiqueUtilisation;  // Liste des utilisations de la pièce

    @ManyToMany(mappedBy = "piecesDetachees", fetch = FetchType.EAGER)
    private List<Equipement> equipements;

    @OneToMany(mappedBy = "pieceDetachee", cascade = CascadeType.ALL)
    @JsonBackReference(value = "intervention-piece")
    private List<InterventionPieceDetachee> interventionPieces;

	@OneToMany(mappedBy = "pieceDetachee", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnoreProperties("pieceDetachee")
	private List<AchatPiece> achats;


	@Transient
    public String getStatut() {
        if (quantiteStock == 0) return "Rupture";
        if (quantiteStock < quantiteMinimale) return "Stock bas";
        return "Disponible";
    }


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getNom() {
		return nom;
	}


	public void setNom(String nom) {
		this.nom = nom;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}


	public String getReference() {
		return reference;
	}


	public void setReference(String reference) {
		this.reference = reference;
	}


	public String getFournisseur() {
		return fournisseur;
	}


	public void setFournisseur(String fournisseur) {
		this.fournisseur = fournisseur;
	}


	public double getCoutUnitaire() {
		return coutUnitaire;
	}


	public void setCoutUnitaire(double coutUnitaire) {
		this.coutUnitaire = coutUnitaire;
	}


	public int getQuantiteStock() {
		return quantiteStock;
	}


	public void setQuantiteStock(int quantiteStock) {
		this.quantiteStock = quantiteStock;
	}


	public int getQuantiteMinimale() {
		return quantiteMinimale;
	}


	public void setQuantiteMinimale(int quantiteMinimale) {
		this.quantiteMinimale = quantiteMinimale;
	}


	public String getImage() {
		return image;
	}


	public void setImage(String image) {
		this.image = image;
	}


	public LocalDate getDateAchat() {
		return dateAchat;
	}


	public void setDateAchat(LocalDate dateAchat) {
		this.dateAchat = dateAchat;
	}


	public LocalDate getDatePeremption() {
		return datePeremption;
	}


	public void setDatePeremption(LocalDate datePeremption) {
		this.datePeremption = datePeremption;
	}


	public List<String> getHistoriqueUtilisation() {
		return historiqueUtilisation;
	}


	public void setHistoriqueUtilisation(List<String> historiqueUtilisation) {
		this.historiqueUtilisation = historiqueUtilisation;
	}


	public List<Equipement> getEquipements() {
		return equipements;
	}


	public void setEquipements(List<Equipement> equipements) {
		this.equipements = equipements;
	}



    
    
}
