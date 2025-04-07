package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "types_equipements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypesEquipements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String image;

    @JsonManagedReference
    @OneToMany(mappedBy = "typeEquipement", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<AttributEquipements> attributs;

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

	public List<AttributEquipements> getAttributs() {
		return attributs;
	}

	public void setAttributs(List<AttributEquipements> attributs) {
		this.attributs = attributs;
	}

}
