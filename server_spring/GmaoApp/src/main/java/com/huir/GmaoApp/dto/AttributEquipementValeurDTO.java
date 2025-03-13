package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.AttributEquipementValeur;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttributEquipementValeurDTO {

    private Long id;
    private String valeur;
    private Long attributEquipementId;
    private Long typesEquipementId;

    // Constructor to map from entity to DTO
    public AttributEquipementValeurDTO(AttributEquipementValeur attributEquipementValeur) {
        this.id = attributEquipementValeur.getId();
        this.valeur = attributEquipementValeur.getValeur();
        this.attributEquipementId = attributEquipementValeur.getAttributEquipement() != null
                ? attributEquipementValeur.getAttributEquipement().getId()
                : null;
        this.typesEquipementId = attributEquipementValeur.getTypeEquipement() != null
                ? attributEquipementValeur.getTypeEquipement().getId()
                : null;
    }
}
