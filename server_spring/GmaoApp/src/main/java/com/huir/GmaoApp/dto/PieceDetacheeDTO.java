package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.PieceDetachee;

public class PieceDetacheeDTO {

    private Long id;
    private String nom;
    private String description;
    private String reference;
    private String fournisseur;
    private double coutUnitaire;
    private int quantiteStock;
    private int quantiteMinimale;
    private String dateAchat;
    private String datePeremption;
    private String historiqueUtilisation;
    private String image;

    public PieceDetacheeDTO() {}
   
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
        this.image=pieceDetachee.getImage();

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



	public String getDateAchat() {
		return dateAchat;
	}



	public void setDateAchat(String dateAchat) {
		this.dateAchat = dateAchat;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getDatePeremption() {
		return datePeremption;
	}



	public void setDatePeremption(String datePeremption) {
		this.datePeremption = datePeremption;
	}



	public String getHistoriqueUtilisation() {
		return historiqueUtilisation;
	}



	public void setHistoriqueUtilisation(String historiqueUtilisation) {
		this.historiqueUtilisation = historiqueUtilisation;
	}
}
