package com.huir.GmaoApp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attribut_equipement_valeurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttributEquipementValeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String valeur;

    @ManyToOne
    @JoinColumn(name = "attribut_id")
    private AttributEquipements attributEquipement;

    @ManyToOne
    @JoinColumn(name = "type_equipement_id")
    private TypesEquipements typeEquipement;

    @ManyToOne
    @JoinColumn(name = "equipement_id")
    private Equipement equipement; // Links to the Equipement entity
}
