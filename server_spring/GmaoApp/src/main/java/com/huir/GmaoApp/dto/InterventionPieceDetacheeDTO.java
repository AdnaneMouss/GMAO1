package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.InterventionPieceDetachee;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionPieceDetacheeDTO {

    private Long id;
    private Long interventionId;
    private Long pieceDetacheeId;

    private String pieceNom;
    private String pieceReference;

    private Integer quantiteUtilisee;

    // Constructor to convert from entity to DTO
    public InterventionPieceDetacheeDTO(InterventionPieceDetachee entity) {
        this.id = entity.getId();
        this.interventionId = entity.getIntervention() != null ? entity.getIntervention().getDuree() : null;
        this.pieceDetacheeId = entity.getPieceDetachee() != null ? entity.getPieceDetachee().getId() : null;
        this.pieceNom = entity.getPieceDetachee() != null ? entity.getPieceDetachee().getNom() : null;
        this.pieceReference = entity.getPieceDetachee() != null ? entity.getPieceDetachee().getReference() : null;
        this.quantiteUtilisee = entity.getQuantiteUtilisee();
    }

    public InterventionPieceDetacheeDTO(Long pieceId, String nom, String reference, int quantiteUtilisee) {
        this.id = pieceId;
        this.pieceNom = nom;
        this.pieceReference = reference;
        this.quantiteUtilisee = quantiteUtilisee;
    }

}
