package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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

    // Par exemple, le numéro de l'étage
    private int num;

    // Relation ManyToOne avec Batiment (l'étage appartient à un batiment)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batiment_id")
    @JsonBackReference("batiment-etage")
    private Batiment batiment;

    // Relation OneToMany avec Salle (un étage contient plusieurs salles)
    @OneToMany(mappedBy = "etage", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference("etage-salle")
    private List<Salle> salles;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	public Batiment getBatiment() {
		return batiment;
	}

	public void setBatiment(Batiment batiment) {
		this.batiment = batiment;
	}

	public List<Salle> getSalles() {
		return salles;
	}

	public void setSalles(List<Salle> salles) {
		this.salles = salles;
	}
    
    
    
    
}
