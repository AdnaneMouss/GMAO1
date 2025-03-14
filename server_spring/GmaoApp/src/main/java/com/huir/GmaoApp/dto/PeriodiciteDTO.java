
package com.huir.GmaoApp.dto;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

public class PeriodiciteDTO {

    private Long id;
    private List<DayOfWeek> joursSemaine; // Liste des jours de la semaine
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String repeter; // Champ 'Répéter' sous forme de chaîne

    // Constructeurs
    public PeriodiciteDTO() {}

    public PeriodiciteDTO(Long id, List<DayOfWeek> joursSemaine, LocalDate dateDebut, LocalDate dateFin, String repeter) {
        this.id = id;
        this.joursSemaine = joursSemaine;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.repeter = repeter;
    }

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
