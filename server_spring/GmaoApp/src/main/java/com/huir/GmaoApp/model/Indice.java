package com.huir.GmaoApp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Indice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomIndice;
    private Double seuilIndice;

    private Long equipementId;
    // Constructeurs
    public Indice() {}

    public Indice(String nomIndice, Double seuilIndice,  Long equipementId) {
        this.nomIndice = nomIndice;
        this.seuilIndice = seuilIndice;
        this.equipementId= equipementId;
       
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomIndice() {
        return nomIndice;
    }

    public void setNomIndice(String nomIndice) {
        this.nomIndice = nomIndice;
    }

    public Double getSeuilIndice() {
        return seuilIndice;
    }

    public void setSeuilIndice(Double seuilIndice) {
        this.seuilIndice = seuilIndice;
    }

	public Long getEquipementId() {
		return equipementId;
	}

	public void setEquipementId(Long equipementId) {
		this.equipementId = equipementId;
	}

  
}