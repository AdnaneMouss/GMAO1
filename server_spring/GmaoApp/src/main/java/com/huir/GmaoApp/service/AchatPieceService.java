package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.AchatPieceDTO;
import com.huir.GmaoApp.model.AchatPiece;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.repository.AchatPiecesRepository;
import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

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

    public List<AchatPieceDTO> getAchatsByPieceId(Long pieceId) {
        List<AchatPiece> achats = achatPieceRepository.findByPieceDetacheeId(pieceId);
        return achats.stream()
                .map(achat -> AchatPieceDTO.builder()
                        .id(achat.getId())
                        .dateAchat(achat.getDateAchat())
                        .quantite(achat.getQuantite())
                        .coutUnitaire(achat.getCoutUnitaire())
                        .pieceId(achat.getPieceDetachee().getId())
                        .nomPiece(achat.getPieceDetachee().getNom())
                        .referencePiece(achat.getPieceDetachee().getReference())
                        .build())
                .toList();
    }

    public AchatPiece mettreAJourAchat(Long achatId, LocalDate dateAchat, int quantite, double coutUnitaire) {
        // Fetch the existing AchatPiece
        AchatPiece achat = achatPieceRepository.findById(achatId)
                .orElseThrow(() -> new RuntimeException("Achat not found"));

        // Update only the updatable fields
        achat.setDateAchat(dateAchat);
        achat.setQuantite(quantite);
        achat.setCoutUnitaire(coutUnitaire);

        // Save and return the updated entity
        return achatPieceRepository.save(achat);
    }


    public void supprimerAchat(Long achatId) {
        if (!achatPieceRepository.existsById(achatId)) {
            throw new RuntimeException("Achat introuvable.");
        }
        achatPieceRepository.deleteById(achatId);
    }


}
