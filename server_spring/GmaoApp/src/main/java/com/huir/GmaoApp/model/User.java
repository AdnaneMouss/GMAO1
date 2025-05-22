package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "nom"),
        @UniqueConstraint(columnNames = "gsm")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Le nom ne peut pas être vide")
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Civilite civilite;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "L'email ne peut pas être vide")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@huir\\.ma$", message = "L'email doit se terminer par @huir.ma")
    private String email;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Le nom d'utilisateur ne peut pas être vide")
    private String username;

    @Column(nullable = false)
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Pattern(
            regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>]).*$",
            message = "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)"
    )
    private String password;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Size(min = 10, max = 10, message = "Le numéro de téléphone doit contenir exactement 10 chiffres")
    @Pattern(regexp = "\\d{10}", message = "Le numéro de téléphone ne doit contenir que des chiffres")
    private String gsm;

    @Column
    private String image;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private boolean actif = true;

    private boolean notifications = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateInscription = LocalDateTime.now();

    // Relation avec les maintenances créées par l'utilisateur
    @JsonIgnore // Empêche la sérialisation de cette relation
    @JsonManagedReference("user-creePar")
    @OneToMany(mappedBy = "creePar", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MaintenanceCorrective> maintenancesCreees;

    // Relation avec les maintenances assignées à l'utilisateur
    @JsonIgnore // Empêche la sérialisation de cette relation
    @JsonManagedReference("user-affecteA")
    @OneToMany(mappedBy = "affecteA", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MaintenanceCorrective> maintenancesAssignees;
    
    @JsonIgnore // Empêche la sérialisation pour éviter les boucles infinies
    @JsonManagedReference("user-intervention1")
    @OneToMany(mappedBy = "technicien", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Intervention> interventions;

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

	public Civilite getCivilite() {
		return civilite;
	}

	public void setCivilite(Civilite civilite) {
		this.civilite = civilite;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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

	public boolean isNotifications() {
		return notifications;
	}

	public void setNotifications(boolean notifications) {
		this.notifications = notifications;
	}

	public LocalDateTime getDateInscription() {
		return dateInscription;
	}

	public void setDateInscription(LocalDateTime dateInscription) {
		this.dateInscription = dateInscription;
	}

	public List<MaintenanceCorrective> getMaintenancesCreees() {
		return maintenancesCreees;
	}

	public void setMaintenancesCreees(List<MaintenanceCorrective> maintenancesCreees) {
		this.maintenancesCreees = maintenancesCreees;
	}

	public List<MaintenanceCorrective> getMaintenancesAssignees() {
		return maintenancesAssignees;
	}

	public void setMaintenancesAssignees(List<MaintenanceCorrective> maintenancesAssignees) {
		this.maintenancesAssignees = maintenancesAssignees;
	}

	public List<Intervention> getInterventions() {
		return interventions;
	}

	public void setInterventions(List<Intervention> interventions) {
		this.interventions = interventions;
	}


    
}
