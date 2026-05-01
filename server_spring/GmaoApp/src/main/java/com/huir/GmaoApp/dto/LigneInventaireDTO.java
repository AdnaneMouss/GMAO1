package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.LigneInventaire;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LigneInventaireDTO {

    private Long id;
    private Long pieceId;
    private String nomPiece;
    private int stockTheorique;
    private int stockPhysique;
    private int ecart;
    private String commentaire;

    public LigneInventaireDTO() {
    }

    // Constructor from entity
    public LigneInventaireDTO(LigneInventaire ligneInventaire) {
        this.id = ligneInventaire.getId();
        if (ligneInventaire.getPiece() != null) {
            this.pieceId = ligneInventaire.getPiece().getId();
            this.nomPiece = ligneInventaire.getPiece().getNom();
        }
        this.stockTheorique = ligneInventaire.getStockTheorique();
        this.stockPhysique = ligneInventaire.getStockPhysique();
        this.ecart = ligneInventaire.getEcart();
        this.commentaire = ligneInventaire.getCommentaire();
    }
}
