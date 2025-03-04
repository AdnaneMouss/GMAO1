package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.TypesEquipements;
import lombok.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypesEquipementsDTO {

    private Long id;
    private String type;
    private String image;
    private List<AttributEquipementsDTO> attributs;

    public TypesEquipementsDTO(TypesEquipements typesEquipements) {
        this.id=typesEquipements.getId();
this.type = typesEquipements.getType();
this.image = typesEquipements.getImage();
        this.attributs = typesEquipements.getAttributs() != null
                ? typesEquipements.getAttributs().stream()
                .map(AttributEquipementsDTO::new)
                .collect(Collectors.toList())
                : null;
    }

}
