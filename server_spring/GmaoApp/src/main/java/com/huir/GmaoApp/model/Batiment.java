package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int numBatiment;
    private String intitule;
    private Boolean actif;
    @OneToMany(mappedBy = "batiment", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Etage> etages;
}
