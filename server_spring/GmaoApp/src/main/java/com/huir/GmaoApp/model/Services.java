package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom;

    @Column
    private String image;

    @Column
    private boolean actif = true;

    @Column
    private String description;

    // Relation bidirectionnelle avec Equipement
    // Dans l'entité Equipement, le champ "service" doit être annoté avec @JsonBackReference("service-equipement")
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("service-equipement")
    private List<Equipement> equipements;
}
