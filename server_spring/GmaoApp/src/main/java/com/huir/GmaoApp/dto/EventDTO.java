package com.huir.GmaoApp.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.huir.GmaoApp.model.DaysOfWeek;
import com.huir.GmaoApp.model.Event;
import com.huir.GmaoApp.model.Months;


public class EventDTO {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String repetitionType; // Type de répétition en français
    private Map<String, Boolean> selectedDays; // Jours sélectionnés
    private Map<String, Boolean> selectedMonth; // Mois sélectionné (pour "MENSUEL")

    // Listes prédéfinies
    private List<String> availableDays = DaysOfWeek.DAYS; // Jours de la semaine
    private List<String> availableMonths = Months.MONTHS; // Mois de l'année
    
    public EventDTO toDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setRepetitionType(event.getRepetitionType().toString()); // Convertir l'énumération en chaîne
        dto.setSelectedDays(event.getSelectedDays());
        dto.setSelectedMonth(event.getSelectedMonth());
        return dto;
    };


  


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





	public List<String> getAvailableDays() {
        return availableDays;
    }

    public List<String> getAvailableMonths() {
        return availableMonths;
    }
}