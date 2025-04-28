package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JsonBackReference(value = "intervention-piece1")
    @JoinColumn(name = "intervention_id", nullable = false)
    private Intervention intervention;

    @ManyToOne
    @JoinColumn(name = "piece_detachee_id", nullable = false)
    private PieceDetachee pieceDetachee;

    private Integer quantiteUtilisee;
}
