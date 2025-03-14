package com.huir.GmaoApp.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.AssertTrue;
@Entity

public class MaintenancePeriodique {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrémentation
	    private Long id;
	 @Enumerated(EnumType.STRING)
	    private frequence frequence;
	 @JsonFormat(pattern = "yyyy-MM-dd")
	 private LocalDate dateDebutPrevue;
	 @JsonFormat(pattern = "yyyy-MM-dd")
	 private LocalDate dateFinPrevue;
	 @JsonFormat(pattern = "yyyy-MM-dd")
	 private LocalDate dateProchainemaintenance;
	 
	 @AssertTrue(message = "La date de début doit être antérieure à la date de fin.")
	    public boolean isDateDebutAvantDateFin() {
	        if (dateDebutPrevue == null || dateFinPrevue == null) {
	            return true; // Ne pas déclencher l'erreur si l'une des dates est null
	        }
	        return dateDebutPrevue.isBefore(dateFinPrevue);
	    }
	  private long dureeIntervention;
	  @Enumerated(EnumType.STRING)
	    private Priorite priorite;  
	  @Enumerated(EnumType.STRING)
	    private Statut statut;
	  private String commentaires;
	  private String documentPath;

	// Relation avec le responsable de maintenance
	  @ManyToOne(fetch = FetchType.EAGER)
	    @JsonBackReference
	    @JoinColumn(name = "responsable_maintenance_id")
	    private User responsableMaintenance;
	  
	  @ManyToOne(fetch = FetchType.EAGER)
	    @JsonBackReference
	    @JoinColumn(name = "technicien_maintenance_id")
	    private User technicienMaintenance;
	  
	  public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
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
		public LocalDate getDateProchainemaintenance() {
			return dateProchainemaintenance;
		}
		public void setDateProchainemaintenance(LocalDate dateProchainemaintenance) {
			this.dateProchainemaintenance = dateProchainemaintenance;
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
		
		public void setDureeIntervention(long dureeIntervention) {
			this.dureeIntervention = dureeIntervention;
		}
		public long getDureeIntervention() {
	        if (dateDebutPrevue != null && dateFinPrevue != null) {
	            return ChronoUnit.DAYS.between(dateDebutPrevue, dateFinPrevue); // Calcul de la durée en jours
	        }
	        return 0;
	    }
		public frequence getFrequence() {
			return frequence;
		}
		public void setFrequence(frequence frequence) {
			this.frequence = frequence;
		}
		 public String getDocumentPath() {
		        return documentPath;
		    }

		    public void setDocumentPath(String documentPath) {
		        this.documentPath = documentPath;
		    }
		
		
}

	

	   