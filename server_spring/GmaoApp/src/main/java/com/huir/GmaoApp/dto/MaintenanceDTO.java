package com.huir.GmaoApp.dto;

import lombok.Data;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.huir.GmaoApp.model.ActionMaintenance;
import com.huir.GmaoApp.model.DaysOfWeek;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.Months;
import com.huir.GmaoApp.model.Priorite;
import com.huir.GmaoApp.model.Statut;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.model.*;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;



@Data
public class MaintenanceDTO {
		
private Long id;
private LocalDate dateProchainemaintenance; 
private LocalDate dateDebutPrevue;
private LocalDate dateFinPrevue;
private long dureeIntervention; 
private Priorite priorite;
private Statut statut;
private String commentaires;
private String documentPath;
private frequence frequence;
private List<IndicateurDTO> indicateurs;
@Enumerated(EnumType.STRING) // Ajout de l'enum ActionMaintenance
private ActionMaintenance action;
private String autreAction;
private User technicienId;
private LocalDate startDate;
private LocalDate endDate;
private String repetitionType; // Type de répétition en français
private Map<String, Boolean> selectedDays; // Jours sélectionnés
private Map<String, Boolean> selectedMonth; // Mois sélectionné (pour "MENSUEL")

// Listes prédéfinies
private List<String> availableDays = DaysOfWeek.DAYS; // Jours de la semaine
private List<String> availableMonths = Months.MONTHS; // Mois de l'année
public MaintenanceDTO(Maintenance maintenance ) {
				this.id = maintenance.getId();
				this.dateProchainemaintenance = maintenance.getDateProchainemaintenance();
				this.dateDebutPrevue = maintenance .getDateDebutPrevue();
				this.dateFinPrevue = maintenance.getDateFinPrevue();
				this.priorite = maintenance.getPriorite();
				this.statut = maintenance.getStatut();
				this.commentaires = maintenance.getCommentaires();
				this.documentPath=  maintenance.getDocumentPath();
				this.frequence=maintenance.getFrequence();
				this.dureeIntervention = calculerDureeIntervention(this.dateDebutPrevue, this.dateFinPrevue);
				this.action = maintenance.getAction();  // Assurez-vous que l'objet Maintenance a ce champ.
		        this.autreAction = maintenance.getAutreAction();  
		         this.technicienId=maintenance.getTechnicienMaintenance(); 
		        
		       
		       
				
					}  
		public MaintenanceDTO() {}
		
		
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		
		public String getDocumentPath() {
			return documentPath;
		}
		public void setDocumentPath(String documentPath) {
			this.documentPath = documentPath;
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
		
		public frequence getFrequence() {
			return frequence;
		}
		public void setFrequence(frequence frequence) {
			this.frequence = frequence;
		}
		public long getDureeIntervention() {
		    if (dateDebutPrevue != null && dateFinPrevue != null) {
		        // Calculer la différence en jours entre la date de début et la date de fin
		        return ChronoUnit.DAYS.between(dateDebutPrevue, dateFinPrevue);
		    }
		    return 0; // Si l'une des dates est nulle, retourner 0
		}

	
		
		 private long calculerDureeIntervention(LocalDate debut, LocalDate fin) {
			    if (debut != null && fin != null) {
			        return ChronoUnit.DAYS.between(debut, fin);
			    }
			    return 0; // Si l'une des dates est nulle, on retourne 0
			}
		public List<IndicateurDTO> getIndicateurs() {
			return indicateurs;
		}
		public void setIndicateurs(List<IndicateurDTO> indicateurs) {
			this.indicateurs = indicateurs;
		}
		public ActionMaintenance getAction() {
			return action;
		}
		public void setAction(ActionMaintenance action) {
			this.action = action;
		}
		public String getAutreAction() {
			return autreAction;
		}
		public void setAutreAction(String autreAction) {
			this.autreAction = autreAction;
		}
		public User getTechnicienId() {
			return technicienId;
		}
		public void setTechnicienId(User technicienId) {
			this.technicienId = technicienId;
		}
		public LocalDate getStartDate() {
			return startDate;
		}
		public void setStartDate(LocalDate startDate) {
			this.startDate = startDate;
		}
		public LocalDate getEndDate() {
			return endDate;
		}
		public void setEndDate(LocalDate endDate) {
			this.endDate = endDate;
		}
		public String getRepetitionType() {
			return repetitionType;
		}
		public void setRepetitionType(String repetitionType) {
			this.repetitionType = repetitionType;
		}
		public Map<String, Boolean> getSelectedDays() {
			return selectedDays;
		}
		public void setSelectedDays(Map<String, Boolean> selectedDays) {
			this.selectedDays = selectedDays;
		}
		public Map<String, Boolean> getSelectedMonth() {
			return selectedMonth;
		}
		public void setSelectedMonth(Map<String, Boolean> selectedMonth) {
			this.selectedMonth = selectedMonth;
		}
	
		



		  

		    
		  
		   
		
		
						    
						    
						    
			      
		  
		}
