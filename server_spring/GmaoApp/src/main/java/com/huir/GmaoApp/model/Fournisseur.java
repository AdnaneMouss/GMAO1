package com.huir.GmaoApp.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fournisseur {
	
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String nom;
	@Enumerated(EnumType.STRING)
	    private Type type;
	    private String codepostal;
	    private String adresse;
	    private String email;
	    private String telephone;
	    private boolean actif = true;
	    @Column
	    private String image;
	    @Column(updatable = false)
	    @CreationTimestamp
	    private LocalDateTime dateajout;
	    @JsonIgnore
	    @OneToMany(mappedBy = "fournisseur", fetch = FetchType.EAGER)
	    private List<Contrat> contrats;

		

}
