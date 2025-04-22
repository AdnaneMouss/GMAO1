package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Salle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int num;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "etage_id")
    @JsonBackReference("etage-salle")
	@JsonIgnore
    private Etage etage;

	@JsonManagedReference
	@OneToMany(mappedBy = "salle", fetch = FetchType.EAGER)
	@JsonIgnore
	private List<Equipement> equipement;


    
    
}
