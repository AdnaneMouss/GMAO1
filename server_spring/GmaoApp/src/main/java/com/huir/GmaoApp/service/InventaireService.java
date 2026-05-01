package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.InventaireDTO;
import com.huir.GmaoApp.dto.LigneInventaireDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.InventaireRepository;
import com.huir.GmaoApp.repository.LigneInventaireRepository;
import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import com.huir.GmaoApp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventaireService {

    private final InventaireRepository inventaireRepo;
    private final UserRepository userRepo;
    private final LigneInventaireRepository ligneInventaireRepo;
    private final PieceDetacheeRepository pieceRepo;


    public Inventaire ajouterInventaire(InventaireDTO dto) {
        Inventaire inventaire = new Inventaire();

        // 1. Set date
        inventaire.setDateInventaire(LocalDateTime.now());

        // 2. Associer le responsable
        User responsable = userRepo.findById(dto.getResponsableId())
                .orElseThrow(() -> new RuntimeException("Responsable non trouvé"));
        inventaire.setResponsable(responsable);

        // 3. Ajouter les lignes
        List<LigneInventaire> lignes = new ArrayList<>();
        if (dto.getLignes() != null) {
            for (LigneInventaireDTO ligneDTO : dto.getLignes()) {
                LigneInventaire ligne = new LigneInventaire();
                PieceDetachee piece = pieceRepo.findById(ligneDTO.getPieceId())
                        .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

                ligne.setPiece(piece);
                ligne.setStockPhysique(ligneDTO.getStockPhysique());
                ligne.setStockTheorique(piece.getQuantiteStock()); // 🧠 Le move ici
                ligne.setCommentaire(ligneDTO.getCommentaire());
                ligne.setInventaire(inventaire); // 🔗 Liaison
                lignes.add(ligne);
            }
        }
        inventaire.setLignes(lignes);

        return inventaireRepo.save(inventaire);
    }

    @Transactional
    public Inventaire modifierInventaire(Long id, InventaireDTO dto) {
        Inventaire inventaire = inventaireRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inventaire not found"));

        // 🔁 Update responsable
        if (dto.getResponsableId() != null) {
            User responsable = userRepo.findById(dto.getResponsableId())
                    .orElseThrow(() -> new EntityNotFoundException("Responsable not found"));
            inventaire.setResponsable(responsable);
        }

        // 🧠 Map existing lignes by ID
        Map<Long, LigneInventaire> existingLignes = inventaire.getLignes().stream()
                .filter(l -> l.getId() != null)
                .collect(Collectors.toMap(LigneInventaire::getId, l -> l));

        // 🔎 Collect updated IDs
        Set<Long> updatedIds = dto.getLignes().stream()
                .map(LigneInventaireDTO::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // ❌ Find lignes to remove
        List<LigneInventaire> toRemove = inventaire.getLignes().stream()
                .filter(l -> l.getId() != null && !updatedIds.contains(l.getId()))
                .collect(Collectors.toList());

        // 🗑️ Remove them from inventaire and delete from DB
        toRemove.forEach(ligne -> {
            inventaire.getLignes().remove(ligne);
            ligneInventaireRepo.delete(ligne);
        });

        // ✅ Rebuild lignes
        List<LigneInventaire> updatedLignes = new ArrayList<>();

        for (LigneInventaireDTO ligneDto : dto.getLignes()) {
            LigneInventaire ligne;

            if (ligneDto.getId() != null && existingLignes.containsKey(ligneDto.getId())) {
                ligne = existingLignes.get(ligneDto.getId());
            } else {
                ligne = new LigneInventaire();
                ligne.setInventaire(inventaire); // Important!
            }

            PieceDetachee piece = pieceRepo.findById(ligneDto.getPieceId())
                    .orElseThrow(() -> new EntityNotFoundException("Pièce détachée non trouvée"));

            ligne.setPiece(piece);
            ligne.setStockPhysique(ligneDto.getStockPhysique());
            ligne.setStockTheorique(piece.getQuantiteStock()); // 💥 Stock théorique update ici
            ligne.setCommentaire(ligneDto.getCommentaire());

            updatedLignes.add(ligne);
        }

        inventaire.getLignes().clear(); // clears original list but keeps the same instance
        inventaire.getLignes().addAll(updatedLignes); // fills it with the updated lignes

        return inventaireRepo.save(inventaire);
    }


    @Transactional
    public void corrigerStock(Long inventaireId) {
        Inventaire inventaire = inventaireRepo.findById(inventaireId)
                .orElseThrow(() -> new EntityNotFoundException("Inventaire non trouvé"));

        for (LigneInventaire ligne : inventaire.getLignes()) {
            PieceDetachee piece = ligne.getPiece();
            if (piece != null) {
                Integer stockPhysique = ligne.getStockPhysique();
                if (stockPhysique != null) {
                    piece.setQuantiteStock(stockPhysique);
                    pieceRepo.save(piece);
                }
            }
        }

        inventaire.setStatut(StatutInventaire.CORRIGE);
        inventaireRepo.save(inventaire);
    }


    public List<Inventaire> getAll() {
        return inventaireRepo.findAll();
    }
}



