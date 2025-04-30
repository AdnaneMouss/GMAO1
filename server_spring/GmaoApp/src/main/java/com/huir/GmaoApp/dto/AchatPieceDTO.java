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
    }
}
