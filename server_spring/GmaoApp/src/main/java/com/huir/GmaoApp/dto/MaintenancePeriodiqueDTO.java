package com.huir.GmaoApp.dto;
import java.time.LocalDate;

import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.MaintenancePeriodique;
import com.huir.GmaoApp.model.Priorite;
import com.huir.GmaoApp.model.Statut;
import com.huir.GmaoApp.model.frequence;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;


@Data
	public class MaintenancePeriodiqueDTO extends MaintenanceDTO {
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
		private frequence frequence;
		private LocalDate dateProchainemaintenance; 
		private LocalDate dateDebutPrevue;
		private LocalDate dateFinPrevue;
		private long dureeIntervention; 
		private Priorite priorite;
		private Statut statut;
		private String commentaires;
		private String documentPath;
		

	public MaintenancePeriodiqueDTO(MaintenancePeriodique maintenancePeriodique ) {
		this.id = maintenancePeriodique.getId();
		
		
		this.frequence = maintenancePeriodique.getFrequence();
	}
	public MaintenancePeriodiqueDTO() {}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public frequence getFrequence() {
		return frequence;
	}
	public void setFrequence(frequence frequence) {
		this.frequence = frequence;
	}
	public LocalDate getDateProchainemaintenance() {
		return dateProchainemaintenance;
	}
	public void setDateProchainemaintenance(LocalDate dateProchainemaintenance) {
		this.dateProchainemaintenance = dateProchainemaintenance;
	}
	public LocalDate getDateDebutPrevue() {
		return dateDebutPrevue;
	}
	public void setDateDebutPrevue(LocalDate dateDebutPrevue) {
		this.dateDebutPrevue = dateDebutPrevue;
	}
	public LocalDate getDateFinPrevue() {
		return dateFinPrevue;
	}
	public void setDateFinPrevue(LocalDate dateFinPrevue) {
		this.dateFinPrevue = dateFinPrevue;
	}
	public long getDureeIntervention() {
		return dureeIntervention;
	}
	public void setDureeIntervention(long dureeIntervention) {
		this.dureeIntervention = dureeIntervention;
	}
	public Priorite getPriorite() {
		return priorite;
	}
	public void setPriorite(Priorite priorite) {
		this.priorite = priorite;
	}
	public Statut getStatut() {
		return statut;
	}
	public void setStatut(Statut statut) {
		this.statut = statut;
	}
	public String getCommentaires() {
		return commentaires;
	}
	public void setCommentaires(String commentaires) {
		this.commentaires = commentaires;
	}
	public String getDocumentPath() {
		return documentPath;
	}
	public void setDocumentPath(String documentPath) {
		this.documentPath = documentPath;
	}

	
	
	
	
	}



