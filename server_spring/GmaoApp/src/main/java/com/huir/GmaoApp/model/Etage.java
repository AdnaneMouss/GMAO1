package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Etage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private boolean actif = true;
    // Par exemple, le numéro de l'étage
    private int num;

    // Relation ManyToOne avec Batiment (l'étage appartient à un batiment)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batiment_id")
    @JsonBackReference("batiment-etage")
	@JsonManagedReference
    private Batiment batiment;

    // Relation OneToMany avec Salle (un étage contient plusieurs salles)
    @OneToMany(mappedBy = "etage", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference("etage-salle")
	@JsonIgnore
    private List<Salle> salles;

    
    
}
