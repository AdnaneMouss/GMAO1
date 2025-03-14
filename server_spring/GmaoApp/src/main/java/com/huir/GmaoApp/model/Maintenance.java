package com.huir.GmaoApp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.AssertTrue;

import com.huir.GmaoApp.model.User;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorColumn(name = "type_maintenance")
public class Maintenance {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	 
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
	  
	  @Column(name = "indicateurs")
	    private String indicateurs; 
	  
	// Relation avec le responsable de maintenance
	  @ManyToOne(fetch = FetchType.EAGER)
	    @JsonBackReference
	    @JoinColumn(name = "responsable_maintenance_id")
	    private User responsableMaintenance;
	  
	  @ManyToOne(fetch = FetchType.EAGER)
	    @JsonBackReference
	    @JoinColumn(name = "technicien_maintenance_id")
	    private User technicienMaintenance;
	  
	  

	  @Enumerated(EnumType.STRING)
	    private frequence frequence;
	 
	  
	  
	// Relation avec le service auquel appartient l’équipement
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JsonBackReference
	    private Services service;
	    
	 // Relationship with Salle (Each equipment is in a room)
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "salle_id")
	    private Salle salle;

	    // Relationship with Etage (Each room is in a floor)
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "etage_id")
	    private Etage etage;
	    

	    public frequence getFrequence() {
			return frequence;
		}
		public void setFrequence(frequence frequence) {
			this.frequence = frequence;
		}
		// Relationship with Batiment (Each floor is in a building)
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "batiment_id")
	    private Batiment batiment;
	    
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "equipement_id")
	    @JsonBackReference
	    @JsonIgnore
	    private Equipement equipement;
	    @JsonIgnore
	    public String documentPath;
	    
	    @Enumerated(EnumType.STRING)
	    private ActionMaintenance action;
	  
	    private String autreAction;
	    
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "event_id")
	    @JsonBackReference
	    private Event event;


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
	public String getIndicateurs() {
		return indicateurs;
	}
	public void setIndicateurs(String indicateurs) {
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
		public User getTechnicienMaintenance() {
			return technicienMaintenance;
		}
		public void setTechnicienMaintenance(User technicienMaintenance) {
			this.technicienMaintenance = technicienMaintenance;
		}
		public Event getEvent() {
			return event;
		}
		public void setEvent(Event event) {
			this.event = event;
		}
		
	    
	   
	
	
	

	   
	    
	   
	  
	  
}
