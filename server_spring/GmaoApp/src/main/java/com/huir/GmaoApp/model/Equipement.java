package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.huir.GmaoApp.dto.MaintenanceDTO;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "equipements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String image;
    private String nom;
    private String description;
    private String numeroSerie;
    private String modele;
    private String marque;
    @Enumerated(EnumType.STRING)
    private StatutEquipement statut = StatutEquipement.EN_SERVICE;
    private boolean actif;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM/dd/yyyy")
    private LocalDate dateAchat;

    @Column(nullable = true, updatable = false)
    private LocalDateTime dateMiseEnService;

    private String garantie;
    private LocalDate dateDerniereMaintenance;
    private Double coutAchat;
    private String labelSuivi;  // Indicateur
    private double valeurSuivi; // Seuil

    // Relation avec TypesEquipements (Chaque équipement appartient à un type)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_equipement_id")
    private TypesEquipements typeEquipement;

    // Relation avec le service auquel appartient l’équipement
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference // Cette annotation empêche la boucle infinie avec Services
    private Services service;

    // Relation avec Salle (Chaque équipement est dans une salle)
	@JsonBackReference("salle-equipement")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "salle_id")
    private Salle salle;

    // Relation avec Etage (Chaque salle est dans un étage)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etage_id")
    private Etage etage;

    // Relation avec Batiment (Chaque étage est dans un bâtiment)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    // Maintenance corrective liée à cet équipement
    @JsonManagedReference
    @OneToMany(mappedBy = "equipement", fetch = FetchType.EAGER)
    private List<MaintenanceCorrective> maintenanceCorrectives;

    // Maintenance préventive et autres maintenances liées à cet équipement
    @JsonManagedReference
    @OneToMany(mappedBy = "equipement", fetch = FetchType.EAGER)
    private List<Maintenance> maintenances;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getNumeroSerie() {
		return numeroSerie;
	}

	public void setNumeroSerie(String numeroSerie) {
		this.numeroSerie = numeroSerie;
	}

	public String getModele() {
		return modele;
	}

	public void setModele(String modele) {
		this.modele = modele;
	}

	public String getMarque() {
		return marque;
	}

	public void setMarque(String marque) {
		this.marque = marque;
	}

	public StatutEquipement getStatut() {
		return statut;
	}

	public void setStatut(StatutEquipement statut) {
		this.statut = statut;
	}

	public boolean isActif() {
		return actif;
	}

	public void setActif(boolean actif) {
		this.actif = actif;
	}

	public LocalDate getDateAchat() {
		return dateAchat;
	}

	public void setDateAchat(LocalDate dateAchat) {
		this.dateAchat = dateAchat;
	}

	public String getGarantie() {
		return garantie;
	}

	public void setGarantie(String garantie) {
		this.garantie = garantie;
	}

	public LocalDate getDateDerniereMaintenance() {
		return dateDerniereMaintenance;
	}

	public void setDateDerniereMaintenance(LocalDate dateDerniereMaintenance) {
		this.dateDerniereMaintenance = dateDerniereMaintenance;
	}

	public Double getCoutAchat() {
		return coutAchat;
	}

	public void setCoutAchat(Double coutAchat) {
		this.coutAchat = coutAchat;
	}

	public String getLabelSuivi() {
		return labelSuivi;
	}

	public void setLabelSuivi(String labelSuivi) {
		this.labelSuivi = labelSuivi;
	}

	public double getValeurSuivi() {
		return valeurSuivi;
	}

	public void setValeurSuivi(double valeurSuivi) {
		this.valeurSuivi = valeurSuivi;
	}

	public TypesEquipements getTypeEquipement() {
		return typeEquipement;
	}

	public void setTypeEquipement(TypesEquipements typeEquipement) {
		this.typeEquipement = typeEquipement;
	}

	public Services getService() {
		return service;
	}

	public void setService(Services service) {
		this.service = service;
	}

	public Salle getSalle() {
		return salle;
	}

	public void setSalle(Salle salle) {
		this.salle = salle;
	}

	public Etage getEtage() {
		return etage;
	}

	public void setEtage(Etage etage) {
		this.etage = etage;
	}

	public Batiment getBatiment() {
		return batiment;
	}

	public void setBatiment(Batiment batiment) {
		this.batiment = batiment;
	}

	public List<MaintenanceCorrective> getMaintenanceCorrectives() {
		return maintenanceCorrectives;
	}

	public void setMaintenanceCorrectives(List<MaintenanceCorrective> maintenanceCorrectives) {
		this.maintenanceCorrectives = maintenanceCorrectives;
	}

	public List<Maintenance> getMaintenances() {
		return maintenances;
	}

	public void setMaintenances(List<Maintenance> maintenances) {
		this.maintenances = maintenances;
	}


    
    
}
