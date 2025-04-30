package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "achats_pieces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchatPiece {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dateAchat;

    @Column(nullable = false)
    private int quantite;

    @Column(nullable = false)
    private double coutUnitaire;

    @ManyToOne
    @JoinColumn(name = "piece_id", nullable = false)
    @JsonIgnoreProperties("achats")
    private PieceDetachee pieceDetachee;
}
