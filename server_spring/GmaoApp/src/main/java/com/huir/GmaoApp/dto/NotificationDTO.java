package com.huir.GmaoApp.dto;

import java.time.LocalDateTime;

import com.huir.GmaoApp.model.Notification;

public class NotificationDTO {

    private Long id;
    private LocalDateTime createdAt;
    private String message;
    private boolean seen;
  //  private Long maintenanceId; // ID de la maintenance associée

    public NotificationDTO() {
    }

    public NotificationDTO(Long id, LocalDateTime createdAt, String message, boolean seen, Long maintenanceId) {
        this.id = id;
        this.createdAt = createdAt;
        this.message = message;
        this.seen = seen;
       // this.maintenanceId = maintenanceId;
    }

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }

    

    // Méthode pour convertir une entité Notification en DTO
   
    
}
