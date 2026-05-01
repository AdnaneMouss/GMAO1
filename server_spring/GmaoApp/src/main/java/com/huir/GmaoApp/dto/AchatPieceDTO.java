package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.AchatPiece;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchatPieceDTO {
    private Long id;
    private LocalDate dateAchat;
    private int quantite;
    private double coutUnitaire;
    // Info simplifiée sur la pièce liée
    private Long pieceId;
    private String nomPiece;
    private String referencePiece;

    public AchatPieceDTO(AchatPiece achatPiece) {
        this.id = achatPiece.getId();
        this.dateAchat = achatPiece.getDateAchat();
        this.quantite = achatPiece.getQuantite();
        this.coutUnitaire = achatPiece.getCoutUnitaire();
        this.pieceId = achatPiece.getPieceDetachee().getId();
        this.nomPiece = achatPiece.getPieceDetachee().getNom();
        this.referencePiece = achatPiece.getPieceDetachee().getReference();
    }

}
