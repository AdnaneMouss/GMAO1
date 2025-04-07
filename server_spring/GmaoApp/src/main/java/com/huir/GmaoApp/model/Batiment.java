package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int numBatiment;
    private String intitule;
    private Boolean actif;

    // Gestion de la relation avec Etage
    // Ici, Batiment est le parent, donc on utilise @JsonManagedReference avec un nom de référence unique.
    @OneToMany(mappedBy = "batiment", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference("batiment-etage")
    private List<Etage> etages;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getNumBatiment() {
		return numBatiment;
	}

	public void setNumBatiment(int numBatiment) {
		this.numBatiment = numBatiment;
	}

	public String getIntitule() {
		return intitule;
	}

	public void setIntitule(String intitule) {
		this.intitule = intitule;
	}

	public Boolean getActif() {
		return actif;
	}

	public void setActif(Boolean actif) {
		this.actif = actif;
	}

	public List<Etage> getEtages() {
		return etages;
	}

	public void setEtages(List<Etage> etages) {
		this.etages = etages;
	}
    
    
    
}
