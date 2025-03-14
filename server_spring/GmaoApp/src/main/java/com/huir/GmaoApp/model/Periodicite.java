
package com.huir.GmaoApp.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Periodicite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<DayOfWeek> joursSemaine; // Liste des jours de la semaine

    private LocalDate dateDebut;
    private LocalDate dateFin;

  
    private String repeter;

    // Getters et setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

   

    public List<DayOfWeek> getJoursSemaine() {
        return joursSemaine;
    }

    public void setJoursSemaine(List<DayOfWeek> joursSemaine) {
        this.joursSemaine = joursSemaine;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public String getRepeter() {
        return repeter;
    }

    public void setRepeter(String repeter) {
        this.repeter = repeter;
    }

   
}
