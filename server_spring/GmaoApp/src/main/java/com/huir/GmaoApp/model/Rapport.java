package com.huir.GmaoApp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rapports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TypeRapport type;

    @Column(nullable = false)
    private LocalDateTime dateGeneration = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String contenu;
}


