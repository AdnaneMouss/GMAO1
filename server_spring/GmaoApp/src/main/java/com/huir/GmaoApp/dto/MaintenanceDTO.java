package com.huir.GmaoApp.dto;

import lombok.Data;

import java.util.Date;



@Data
public class MaintenanceDTO {
	
	private Long id;
    private String equipement;
    private String departement;
    private String personneResponsable;
    private String frequence;
    private Date dateIntervention;
    private Integer dureeEstimee;
    private String uniteDuree;
    private String piecesRechange;
    private Integer quantitePieces;
    private String localisation;
    private String statut;
    private String imageEquipement;
     
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEquipement() {
        return equipement;
    }

    public void setEquipement(String equipement) {
        this.equipement = equipement;
    }

    public String getDepartement() {
        return departement;
    }

    public void setDepartement(String departement) {
        this.departement = departement;
    }

    public String getPersonneResponsable() {
        return personneResponsable;
    }

    public void setPersonneResponsable(String personneResponsable) {
        this.personneResponsable = personneResponsable;
    }

    public String getFrequence() {
        return frequence;
    }

    public void setFrequence(String frequence) {
        this.frequence = frequence;
    }

    public Date getDateIntervention() {
        return dateIntervention;
    }

    public void setDateIntervention(Date dateIntervention) {
        this.dateIntervention = dateIntervention;
    }

    public Integer getDureeEstimee() {
        return dureeEstimee;
    }

    public void setDureeEstimee(Integer dureeEstimee) {
        this.dureeEstimee = dureeEstimee;
    }

    public String getUniteDuree() {
        return uniteDuree;
    }

    public void setUniteDuree(String uniteDuree) {
        this.uniteDuree = uniteDuree;
    }

    public String getPiecesRechange() {
        return piecesRechange;
    }

    public void setPiecesRechange(String piecesRechange) {
        this.piecesRechange = piecesRechange;
    }

    public Integer getQuantitePieces() {
        return quantitePieces;
    }

    public void setQuantitePieces(Integer quantitePieces) {
        this.quantitePieces = quantitePieces;
    }

    public String getLocalisation() {
        return localisation;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

   public String getImageEquipement() {
        return imageEquipement;
    }

    public void setImageEquipement(String imageEquipement) {
        this.imageEquipement = imageEquipement;
    }
    
    public MaintenanceDTO() {
    }
    
   
    
    			
      
  
}
