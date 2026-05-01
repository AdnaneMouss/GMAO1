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
	private boolean actif;
    @JsonManagedReference
    @OneToMany(mappedBy = "typeEquipement", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<AttributEquipements> attributs;


}
