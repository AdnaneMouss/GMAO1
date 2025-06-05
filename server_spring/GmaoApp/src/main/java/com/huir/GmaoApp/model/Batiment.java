package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

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
    private boolean actif = true;


    @OneToMany(mappedBy = "batiment", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference("batiment-etage")
	@JsonIgnore
    private List<Etage> etages;

    
    
}
