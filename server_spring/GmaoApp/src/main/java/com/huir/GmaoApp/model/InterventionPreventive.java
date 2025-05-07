package com.huir.GmaoApp.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
@Entity
public class InterventionPreventive {

	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;


	    // L'intervention est réalisée par un technicien spécifique
	    @JsonBackReference("user-intervention")
	    @ManyToOne
	    @JoinColumn(name = "technicien_id", nullable = false)
	    private User technicien;

	    // Type de l'intervention (préventive, etc.)
	    @Enumerated(EnumType.STRING)
	    private TypeIntervention type;

	    // Description détaillée de l'intervention réalisée
	    @Column(nullable = false, columnDefinition = "TEXT")
	    private String description;

	    @Transient
	    private Long duree;

	    public Long getDuree() {
	        if (maintenance != null) {
	            return maintenance.getId();
	        }
	        return null;
	    }


	    // Lien avec la maintenance  si applicable
	    @JsonBackReference("maintenance-intervention")
	    @ManyToOne
	    @JoinColumn(name = "maintenance_id", nullable = false)
	    private Maintenance maintenance;

	    // Commentaires du technicien après l'intervention
	    @Column(columnDefinition = "TEXT")
	    private String remarques;

	    // Preuve de l'intervention (photos avant/après)
	    @OneToMany(mappedBy = "interventionPreventive", cascade = CascadeType.ALL , orphanRemoval = true)
	    private List<PhotosIntervention> photos;

	   // @OneToMany(mappedBy = "interventionPreventive", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	    //@JsonManagedReference(value = "intervention-piece1")
	    //private List<InterventionPieceDetachee> interventionPieces;

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
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

	

		public void setDuree(Long duree) {
			this.duree = duree;
		}

	
		
		
		
		
		
		
		
	}

