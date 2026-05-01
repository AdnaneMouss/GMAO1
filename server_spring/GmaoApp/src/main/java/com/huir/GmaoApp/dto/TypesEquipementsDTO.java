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
	private boolean actif;
    private List<AttributEquipementsDTO> attributs;

    public TypesEquipementsDTO(TypesEquipements typesEquipements) {
        this.id=typesEquipements.getId();
this.type = typesEquipements.getType();
this.image = typesEquipements.getImage();
this.actif=typesEquipements.isActif();
        this.attributs = typesEquipements.getAttributs() != null
                ? typesEquipements.getAttributs().stream()
                .map(AttributEquipementsDTO::new)
                .collect(Collectors.toList())
                : null;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public List<AttributEquipementsDTO> getAttributs() {
		return attributs;
	}

	public void setAttributs(List<AttributEquipementsDTO> attributs) {
		this.attributs = attributs;
	}

}
