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
public class Etage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int num;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batiment_id")
    private Batiment batiment;

    @OneToMany(mappedBy = "etage", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Salle> salles;
}
