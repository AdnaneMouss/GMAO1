package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.AttributEquipementType;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.TypesEquipements;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttributEquipementsDTO {

    private Long id;
    private String nom;
    private Boolean obligatoire;
    private Boolean actif;
    private String attributEquipementType;  // Change this to String
    private TypesEquipements typeEquipement;
    private List<AttributEquipementValeurDTO> attributEquipementValeurs;
    private Long attributId;
    public AttributEquipementsDTO(AttributEquipements attributEquipements) {
        this.id = attributEquipements.getId();
        this.nom = attributEquipements.getNom();
        this.obligatoire=attributEquipements.getObligatoire();
        this.actif=attributEquipements.getActif();
        // Convert the enum to String here
        this.attributEquipementType = attributEquipements.getAttributEquipementType() != null
                ? attributEquipements.getAttributEquipementType().name()
                : null;
        this.typeEquipement = attributEquipements.getTypeEquipement();
    }
	public Long getAttributId() {
		return attributId;
	}
	public void setAttributId(Long attributId) {
		this.attributId = attributId;
	}
    
    
}
