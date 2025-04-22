package com.huir.GmaoApp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "intervention_piece_detachee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionPieceDetachee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "intervention_id", nullable = false)
    private Intervention intervention;

    @ManyToOne
    @JoinColumn(name = "piece_detachee_id", nullable = false)
    private PieceDetachee pieceDetachee;

    private Integer quantiteUtilisee;
}
