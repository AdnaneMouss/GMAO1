package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Civilite;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.model.Role;
import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String nom;
    private String email;
    private String password;
    private String gsm;
    private String image;
    private Role role;
    private boolean actif;
    private String username;
    private Civilite civilite;
    private LocalDateTime dateInscription; // Add the dateInscription field

    // Default constructor
    public UserDTO() {
    }

    // Constructor to map a `User` entity to this DTO
    public UserDTO(User user) {
        this.id = user.getId();
        this.nom = user.getNom();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.gsm = user.getGsm();
        this.role = user.getRole();
        this.actif = user.isActif();
        this.image = user.getImage();
        this.username = user.getUsername();
        this.civilite = user.getCivilite();
        this.dateInscription = user.getDateInscription(); // Map the dateInscription field
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public Civilite getCivilite() {
        return civilite;
    }

    public void setCivilite(Civilite civilite) {
        this.civilite = civilite;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getGsm() {
        return gsm;
    }

    public void setGsm(String gsm) {
        this.gsm = gsm;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActif() {
        return actif;
    }

    public void setActif(boolean actif) {
        this.actif = actif;
    }

    public LocalDateTime getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(LocalDateTime dateInscription) {
        this.dateInscription = dateInscription;
    }
}
