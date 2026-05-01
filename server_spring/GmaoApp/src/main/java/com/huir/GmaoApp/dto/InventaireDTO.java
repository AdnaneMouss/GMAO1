package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Inventaire;
import com.huir.GmaoApp.model.StatutInventaire;
import com.huir.GmaoApp.model.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class InventaireDTO {

    private Long id;
    private LocalDateTime dateInventaire;
    private String responsableNom;
    private Long responsableId;
    private List<LigneInventaireDTO> lignes;
    private StatutInventaire statut;
    public InventaireDTO() {
    }
    // Constructor from entity
    public InventaireDTO(Inventaire inventaire) {
        this.id = inventaire.getId();
        this.dateInventaire = inventaire.getDateInventaire();
        this.responsableId = inventaire.getResponsable().getId();
        this.responsableNom = inventaire.getResponsable().getNom();
        this.lignes = inventaire.getLignes() != null
                ? inventaire.getLignes().stream()
                .map(LigneInventaireDTO::new)
                .collect(Collectors.toList())
                : null;
        this.statut=inventaire.getStatut();
    }
}
