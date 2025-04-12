package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.PieceDetachee;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PieceDetacheeDTO {

	private Long id;
	private String nom;
	private String description;
	private String reference;
	private String fournisseur;
	private double coutUnitaire;
	private int quantiteStock;
	private int quantiteMinimale;
	private LocalDate dateAchat;
	private LocalDate datePeremption;
	private List<String> historiqueUtilisation; // Or DTO if it's an object
	private String image;
	private String statut;  // Ensure this is a string value or map enum to string

	// Constructor to map PieceDetachee to PieceDetacheeDTO
	public PieceDetacheeDTO(PieceDetachee pieceDetachee) {
		this.id = pieceDetachee.getId();
		this.nom = pieceDetachee.getNom();
		this.description = pieceDetachee.getDescription();
		this.reference = pieceDetachee.getReference();
		this.fournisseur = pieceDetachee.getFournisseur();
		this.coutUnitaire = pieceDetachee.getCoutUnitaire();
		this.quantiteStock = pieceDetachee.getQuantiteStock();
		this.quantiteMinimale = pieceDetachee.getQuantiteMinimale();
		this.dateAchat = pieceDetachee.getDateAchat();
		this.datePeremption = pieceDetachee.getDatePeremption();
		this.historiqueUtilisation = pieceDetachee.getHistoriqueUtilisation();
		this.image = pieceDetachee.getImage();



		this.statut = pieceDetachee.getStatut();  // Utilise la méthode dynamique du modèle
	}
}
