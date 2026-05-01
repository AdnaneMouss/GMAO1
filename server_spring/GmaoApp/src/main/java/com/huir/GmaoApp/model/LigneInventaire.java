package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LigneInventaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inventaire_id")
    @JsonBackReference("inventaire-lignes")
    @JsonManagedReference
    private Inventaire inventaire;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "piece_id")
    @JsonBackReference("piece-ligne")
    @JsonManagedReference
    private PieceDetachee piece;

    private int stockTheorique;
    private int stockPhysique;

    private int ecart;

    private String commentaire;

    public void setStockPhysique(int stockPhysique) {
        this.stockPhysique = stockPhysique;
        calculateEcart();
    }

    public void setStockTheorique(int stockTheorique) {
        this.stockTheorique = stockTheorique;
        calculateEcart();
    }

    private void calculateEcart() {
        this.ecart = this.stockPhysique - this.stockTheorique;
    }
}
