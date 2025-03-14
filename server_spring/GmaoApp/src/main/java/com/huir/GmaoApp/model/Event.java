package com.huir.GmaoApp.model;



import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;


import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OneToMany;



@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate; // Date de début
    private LocalDate endDate;   // Date de fin

    @Enumerated(EnumType.STRING) // Stocker l'énumération sous forme de chaîne
    private RepetitionType repetitionType; // Type de répétition

    @ElementCollection
    @CollectionTable(name = "selected_days", joinColumns = @JoinColumn(name = "event_id"))
    @MapKeyColumn(name = "day")
    @Column(name = "selected")
    private Map<String, Boolean> selectedDays; // Jours sélectionnés (pour "TOUS_LES_SEMAINES")

    @ElementCollection
    @CollectionTable(name = "selected_month", joinColumns = @JoinColumn(name = "event_id"))
    @MapKeyColumn(name = "month")
    @Column(name = "selected")
    private Map<String, Boolean> selectedMonth; // Mois sélectionné (pour "MENSUEL")
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Maintenance> maintenances;

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public RepetitionType getRepetitionType() {
        return repetitionType;
    }

    public void setRepetitionType(RepetitionType repetitionType) {
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