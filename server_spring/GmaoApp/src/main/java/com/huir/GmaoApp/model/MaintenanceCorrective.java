package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;
import jakarta.validation.constraints.*;
import java.util.List;

@Entity
@Table(name = "maintenance_corrective")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceCorrective {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre de la maintenance est obligatoire")
    private String titre;

    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.EN_ATTENTE; // Par défaut, la maintenance commence en attente

    @Enumerated(EnumType.STRING)
    private Priorite priorite = Priorite.NORMALE;


    private LocalDateTime dateCreation;
    private LocalDateTime dateDemande;
    private LocalDateTime dateCloture;
    private LocalDateTime dateCommencement;

    // ✅ Ajout de noms uniques pour éviter le conflit Jackson
    @JsonBackReference("user-creePar")
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User creePar;

	@JsonBackReference("user-demandeePar")
	@ManyToOne
	@JoinColumn(name = "requested_by")
	private User demandeePar;

    @JsonBackReference("user-affecteA")
    @ManyToOne
    @JoinColumn(name = "technicien_id")
    private User affecteA;

    @JsonBackReference("equipement-maintenance")
    @ManyToOne
    @JoinColumn(name = "equipement_id")
    private Equipement equipement;

    @JsonManagedReference("maintenance-interventions1")
    @OneToMany(mappedBy = "maintenanceCorrective", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Intervention> interventions;

    @PreUpdate
    public void updateDates() {
        if (this.statut == Statut.TERMINEE || this.statut == Statut.ANNULEE) {
            this.dateCloture = LocalDateTime.now();
        }
        else if(this.statut == Statut.EN_COURS){
                this.dateCommencement = LocalDateTime.now();
            }
        }

    public Long getDuree() {
        if (dateCloture != null && dateCommencement != null) {
            return java.time.Duration.between(dateCommencement, dateCloture).toMinutes();
        }
        return null; // ou 0 si tu préfères
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitre() {
		return titre;
	}

	public void setTitre(String titre) {
		this.titre = titre;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Statut getStatut() {
		return statut;
	}

	public void setStatut(Statut statut) {
		this.statut = statut;
	}

	public Priorite getPriorite() {
		return priorite;
	}

	public void setPriorite(Priorite priorite) {
		this.priorite = priorite;
	}

	public LocalDateTime getDateCreation() {
		return dateCreation;
	}

	public void setDateCreation(LocalDateTime dateCreation) {
		this.dateCreation = dateCreation;
	}

	public LocalDateTime getDateCloture() {
		return dateCloture;
	}

	public void setDateCloture(LocalDateTime dateCloture) {
		this.dateCloture = dateCloture;
	}

	public LocalDateTime getDateCommencement() {
		return dateCommencement;
	}

	public void setDateCommencement(LocalDateTime dateCommencement) {
		this.dateCommencement = dateCommencement;
	}

	public User getCreePar() {
		return creePar;
	}

	public void setCreePar(User creePar) {
		this.creePar = creePar;
	}

	public User getAffecteA() {
		return affecteA;
	}

	public void setAffecteA(User affecteA) {
		this.affecteA = affecteA;
	}

	public Equipement getEquipement() {
		return equipement;
	}

	public void setEquipement(Equipement equipement) {
		this.equipement = equipement;
	}

	public List<Intervention> getInterventions() {
		return interventions;
	}

	public void setInterventions(List<Intervention> interventions) {
		this.interventions = interventions;
	}
	
	



}
