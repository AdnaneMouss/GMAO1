package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interventions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // L'intervention est réalisée par un technicien spécifique
    @JsonBackReference("user-intervention1")
    @ManyToOne
    @JoinColumn(name = "technicien_id", nullable = false)
    private User technicien;

    // Type de l'intervention (préventive, corrective, etc.)
    @Enumerated(EnumType.STRING)
    private TypeIntervention type;

    // Description détaillée de l'intervention réalisée
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Transient
    private Long duree;

    public Long getDuree() {
        if (maintenanceCorrective != null) {
            return maintenanceCorrective.getDuree();
        }
        return null;
    }


    // Lien avec la maintenance corrective si applicable
    @JsonBackReference("maintenance-interventions1")
    @ManyToOne
    @JoinColumn(name = "maintenance_id", nullable = true)
    private MaintenanceCorrective maintenanceCorrective;
    
    
    
    
    // Lien avec la maintenance corrective si applicable
    @ManyToOne
    @JoinColumn(name = "maintenanceP_id", nullable = true)
    @JsonBackReference("maintenance-interventions2")
    @JsonIgnore
    private Maintenance maintenance;


    // Commentaires du technicien après l'intervention
    @Column(columnDefinition = "TEXT")
    private String remarques;

    // Preuve de l'intervention (photos avant/après)
    @JsonManagedReference
    @OneToMany(mappedBy = "intervention", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PhotosIntervention> photos;

    @OneToMany(mappedBy = "intervention", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference(value = "intervention-piece1")
    private List<InterventionPieceDetachee> interventionPieces;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getTechnicien() {
		return technicien;
	}

	public void setTechnicien(User technicien) {
		this.technicien = technicien;
	}

	public TypeIntervention getType() {
		return type;
	}

	public void setType(TypeIntervention type) {
		this.type = type;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public MaintenanceCorrective getMaintenanceCorrective() {
		return maintenanceCorrective;
	}

	public void setMaintenanceCorrective(MaintenanceCorrective maintenanceCorrective) {
		this.maintenanceCorrective = maintenanceCorrective;
	}

	public Maintenance getMaintenance() {
		return maintenance;
	}

	public void setMaintenance(Maintenance maintenance) {
		this.maintenance = maintenance;
	}

	public String getRemarques() {
		return remarques;
	}

	public void setRemarques(String remarques) {
		this.remarques = remarques;
	}

	public List<PhotosIntervention> getPhotos() {
		return photos;
	}

	public void setPhotos(List<PhotosIntervention> photos) {
		this.photos = photos;
	}

	public List<InterventionPieceDetachee> getInterventionPieces() {
		return interventionPieces;
	}

	public void setInterventionPieces(List<InterventionPieceDetachee> interventionPieces) {
		this.interventionPieces = interventionPieces;
	}

	public void setDuree(Long duree) {
		this.duree = duree;
	}



}
