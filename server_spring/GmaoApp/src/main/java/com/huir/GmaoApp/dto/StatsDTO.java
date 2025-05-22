package com.huir.GmaoApp.dto;

import lombok.Data;

//StatsDTO.java
@Data
public class StatsDTO {
 private long totalEquipements;
 private long equipementsEnPanne;
 private double coutTotal;
 private long miseEnServiceEquipement;
public long getTotalEquipements() {
	return totalEquipements;
}
public void setTotalEquipements(long totalEquipements) {
	this.totalEquipements = totalEquipements;
}
public long getEquipementsEnPanne() {
	return equipementsEnPanne;
}
public void setEquipementsEnPanne(long equipementsEnPanne) {
	this.equipementsEnPanne = equipementsEnPanne;
}
public double getCoutTotal() {
	return coutTotal;
}
public void setCoutTotal(double coutTotal) {
	this.coutTotal = coutTotal;
}
public long getMiseEnServiceEquipement() {
	return miseEnServiceEquipement;
}
public void setMiseEnServiceEquipement(long miseEnServiceEquipement) {
	this.miseEnServiceEquipement = miseEnServiceEquipement;
}
 
 
}
