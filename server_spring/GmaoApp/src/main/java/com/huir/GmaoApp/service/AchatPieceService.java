package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.AchatPiece;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.repository.AchatPiecesRepository;
import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AchatPieceService {

    private final AchatPiecesRepository achatPieceRepository;
    private final PieceDetacheeRepository pieceDetacheeRepository;

    @Transactional
    public AchatPiece ajouterAchat(Long pieceId, LocalDate dateAchat, int quantite, double coutUnitaire) {
        PieceDetachee piece = pieceDetacheeRepository.findById(pieceId)
                .orElseThrow(() -> new RuntimeException("Pièce non trouvée"));

        AchatPiece achat = AchatPiece.builder()
                .pieceDetachee(piece)
                .dateAchat(dateAchat)
                .quantite(quantite)
                .coutUnitaire(coutUnitaire)
                .build();

        // Sauvegarder l’achat
        AchatPiece savedAchat = achatPieceRepository.save(achat);

        // Mettre à jour le stock de la pièce
        piece.setQuantiteStock(piece.getQuantiteStock() + quantite);
        pieceDetacheeRepository.save(piece);

        return savedAchat;
    }
}
