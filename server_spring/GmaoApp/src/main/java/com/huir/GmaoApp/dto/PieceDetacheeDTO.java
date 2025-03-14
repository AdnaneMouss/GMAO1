package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.PieceDetachee;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

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
	private int quantiteMinimale;
	private String image;
	private String statut;
	private int quantiteStock;  // Added quantiteStock field

	// Ajout des achats (setter séparé)
	private List<AchatPieceDTO> achats;

	// Constructor to initialize DTO from the entity
	public PieceDetacheeDTO(PieceDetachee pieceDetachee) {
		this.id = pieceDetachee.getId();
		this.nom = pieceDetachee.getNom();
		this.description = pieceDetachee.getDescription();
		this.reference = pieceDetachee.getReference();
		this.fournisseur = pieceDetachee.getFournisseur();
		this.quantiteMinimale = pieceDetachee.getQuantiteMinimale();
		this.image = pieceDetachee.getImage();
		this.statut = pieceDetachee.getStatut();
		this.achats = pieceDetachee.getAchats() != null
				? pieceDetachee.getAchats().stream()
				.map(AchatPieceDTO::new)
				.collect(Collectors.toList())
				: null;

		// Calculate quantiteStock dynamically based on AchatPiece
		this.quantiteStock = pieceDetachee.getQuantiteStock(); // This uses the transient getter for quantiteStock
	}
}
