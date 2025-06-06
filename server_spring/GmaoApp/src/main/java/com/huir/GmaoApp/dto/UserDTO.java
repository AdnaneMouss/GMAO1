package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Civilite;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.model.Role;
import java.time.LocalDateTime; 

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserDTO {

    private Long id;

    @NotBlank(message = "Le nom ne peut pas être vide")
    private String nom;

    @NotBlank(message = "L'email ne peut pas être vide")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@huir\\.ma$", message = "L'email doit se terminer par @huir.ma")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Pattern(regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>]).*$", message = "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)")
    private String password;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Size(min = 10, max = 10, message = "Le numéro de téléphone doit contenir exactement 10 chiffres")
    @Pattern(regexp = "\\d{10}", message = "Le numéro de téléphone ne doit contenir que des chiffres")
    private String gsm;

    private String image;
    private Role role;
    private boolean actif;
    private String username;
    private Civilite civilite;
    private LocalDateTime dateInscription;
    private boolean notifications;
  
    public UserDTO() {
    }

    public UserDTO(User user) {
        this.id = user.getId();
        this.nom = user.getNom();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.gsm = user.getGsm();
        this.image = user.getImage();
        this.role = user.getRole();
        this.actif = user.isActif();
        this.username = user.getUsername();
        this.civilite = user.getCivilite();
        this.dateInscription = user.getDateInscription();
        this.notifications = user.isNotifications();
    }

    // Getters et Setters
    public Long getId() {
        return id;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Civilite getCivilite() {
        return civilite;
    }

    public void setCivilite(Civilite civilite) {
        this.civilite = civilite;
    }

    public LocalDateTime getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(LocalDateTime dateInscription) {
        this.dateInscription = dateInscription;
    }
}
