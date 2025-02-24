package com.huir.GmaoApp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interventions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ordre_id", nullable = false)
    private OrdreTravail ordreTravail;

    @ManyToOne
    @JoinColumn(name = "technicien_id", nullable = false)
    private User technicien;

    @Enumerated(EnumType.STRING)
    private TypeIntervention type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    private int duree; // Durée en minutes

    @Column(nullable = false)
    private LocalDateTime dateRealisation;

    @ManyToMany(mappedBy = "interventions")
    private List<PieceDetachee> piecesDetachees;
}

