package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attributs_equipements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttributEquipements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private Boolean obligatoire;

    private Boolean actif;
    @Enumerated(EnumType.STRING)
    private AttributEquipementType attributEquipementType;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "type_equipement_id")
    private TypesEquipements typeEquipement;

    public AttributEquipements(AttributEquipements attributEquipements) {
    }
}
