package com.huir.GmaoApp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ordres_travail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdreTravail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipement_id", nullable = false)
    private Equipement equipement;

    @ManyToOne
    @JoinColumn(name = "responsable_id", nullable = false)
    private User responsable;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Priorite priorite;

    @Enumerated(EnumType.STRING)
    private StatutOrdre statut;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    private LocalDateTime dateCloture;
}




