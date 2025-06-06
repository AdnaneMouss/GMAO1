package com.huir.GmaoApp.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
@Entity
public class RepetitionInstance {
	
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @JsonFormat(pattern = "yyyy-MM-dd")
	    private LocalDate dateRepetition;

	    @Enumerated(EnumType.STRING)
	    private Statut statut;

	    @ManyToOne
	    @JoinColumn(name = "maintenance_id")
	    @JsonBackReference
	    private Maintenance maintenance;
	    
	    
	    @JsonProperty("maintenanceId")
	    public Long getMaintenanceId() {
	        return maintenance != null ? maintenance.getId() : null;
	    }


		public Long getId() {
			return id;
		}


		public void setId(Long id) {
			this.id = id;
		}


		public LocalDate getDateRepetition() {
			return dateRepetition;
		}


		public void setDateRepetition(LocalDate dateRepetition) {
			this.dateRepetition = dateRepetition;
		}


		public Statut getStatut() {
			return statut;
		}


		public void setStatut(Statut statut) {
			this.statut = statut;
		}


		public Maintenance getMaintenance() {
			return maintenance;
		}


		public void setMaintenance(Maintenance maintenance) {
			this.maintenance = maintenance;
		}


		

}
