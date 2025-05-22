package com.huir.GmaoApp.dto;


import java.util.Date;
import java.util.List;

import lombok.Data;

// RapportDTO.java
@Data
public class RapportDTO {
    private Date dateGeneration;
    private Date periodeDebut;
    private Date periodeFin;
    private int totalEquipements;
    private int equipementsEnPanne;
    private double coutTotal;
    private List<EquipementDTO> equipements;
    private List<MaintenanceDTO> maintenances;
	public Date getDateGeneration() {
		return dateGeneration;
	}
	public void setDateGeneration(Date dateGeneration) {
		this.dateGeneration = dateGeneration;
	}
	public Date getPeriodeDebut() {
		return periodeDebut;
	}
	public void setPeriodeDebut(Date periodeDebut) {
		this.periodeDebut = periodeDebut;
	}
	public Date getPeriodeFin() {
		return periodeFin;
	}
	public void setPeriodeFin(Date periodeFin) {
		this.periodeFin = periodeFin;
	}
	public int getTotalEquipements() {
		return totalEquipements;
	}
	public void setTotalEquipements(int totalEquipements) {
		this.totalEquipements = totalEquipements;
	}
	public int getEquipementsEnPanne() {
		return equipementsEnPanne;
	}
	public void setEquipementsEnPanne(int equipementsEnPanne) {
		this.equipementsEnPanne = equipementsEnPanne;
	}
	public double getCoutTotal() {
		return coutTotal;
	}
	public void setCoutTotal(double coutTotal) {
		this.coutTotal = coutTotal;
	}
	public List<EquipementDTO> getEquipements() {
		return equipements;
	}
	public void setEquipements(List<EquipementDTO> equipements) {
		this.equipements = equipements;
	}
	public List<MaintenanceDTO> getMaintenances() {
		return maintenances;
	}
	public void setMaintenances(List<MaintenanceDTO> maintenances) {
		this.maintenances = maintenances;
	}




}