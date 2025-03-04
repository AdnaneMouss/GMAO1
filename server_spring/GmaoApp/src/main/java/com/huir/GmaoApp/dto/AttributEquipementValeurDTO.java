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

    public AttributEquipementValeurDTO(AttributEquipementValeur attributEquipementValeur) {
    }
}
