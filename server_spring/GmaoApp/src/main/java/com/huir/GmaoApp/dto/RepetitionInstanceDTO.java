package com.huir.GmaoApp.dto;

import java.time.LocalDate;

public class RepetitionInstanceDTO {

	  private Long id;
	    private LocalDate dateRepetition;
	    private String statut;
	    private Long maintenanceId;

	    public RepetitionInstanceDTO() {
	    }

	    public RepetitionInstanceDTO(Long id, LocalDate dateRepetition, String statut, Long maintenanceId) {
	        this.id = id;
	        this.dateRepetition = dateRepetition;
	        this.statut = statut;
	        this.maintenanceId = maintenanceId;
	    }

	    // Getters et Setters
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

	    public String getStatut() {
	        return statut;
	    }

	    public void setStatut(String statut) {
	        this.statut = statut;
	    }

	    public Long getMaintenanceId() {
	        return maintenanceId;
	    }

	    public void setMaintenanceId(Long maintenanceId) {
	        this.maintenanceId = maintenanceId;
	    }
	}
