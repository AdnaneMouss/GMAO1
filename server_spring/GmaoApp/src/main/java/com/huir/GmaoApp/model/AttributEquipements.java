package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attributs_equipements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttributEquipements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private Boolean obligatoire;

    private Boolean actif;
    @Enumerated(EnumType.STRING)
    private AttributEquipementType attributEquipementType;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "type_equipement_id")
    private TypesEquipements typeEquipement;

    public AttributEquipements(AttributEquipements attributEquipements) {
    }

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

	public Boolean getObligatoire() {
		return obligatoire;
	}

	public void setObligatoire(Boolean obligatoire) {
		this.obligatoire = obligatoire;
	}

	public Boolean getActif() {
		return actif;
	}

	public void setActif(Boolean actif) {
		this.actif = actif;
	}

	public AttributEquipementType getAttributEquipementType() {
		return attributEquipementType;
	}

	public void setAttributEquipementType(AttributEquipementType attributEquipementType) {
		this.attributEquipementType = attributEquipementType;
	}

	public TypesEquipements getTypeEquipement() {
		return typeEquipement;
	}

	public void setTypeEquipement(TypesEquipements typeEquipement) {
		this.typeEquipement = typeEquipement;
	}
    
    
    
}
