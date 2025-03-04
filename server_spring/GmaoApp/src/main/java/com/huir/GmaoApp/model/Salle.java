package com.huir.GmaoApp.model;

import lombok.*;

import jakarta.persistence.*;

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
    private Etage etage;

}
