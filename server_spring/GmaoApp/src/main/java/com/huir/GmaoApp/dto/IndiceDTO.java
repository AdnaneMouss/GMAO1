package com.huir.GmaoApp.dto;

import lombok.Data;

import com.huir.GmaoApp.model.Indice;

import jakarta.persistence.*;

@Data
public class IndiceDTO {

    private Long id;
    private String nomIndice;
    private Double seuilIndice;

    private Long equipementId;

    // Construction du DTO à partir de l'entité Indice
    public IndiceDTO(Indice indice) {
        this.id = indice.getId();
        this.nomIndice = indice.getNomIndice();
        this.seuilIndice = indice.getSeuilIndice();
        if (indice.getEquipementId() != null) {
            this.equipementId = indice.getEquipementId();  // Associer l'ID de l'équipement
        }
    }

    public IndiceDTO() {}

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
