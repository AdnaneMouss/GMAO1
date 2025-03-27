package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;
import jakarta.validation.constraints.*;
import java.util.List;

@Entity
@Table(name = "maintenance_corrective")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceCorrective {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre de la maintenance est obligatoire")
    private String titre;

    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.EN_ATTENTE; // Par défaut, la maintenance commence en attente

    @Enumerated(EnumType.STRING)
    private Priorite priorite = Priorite.NORMALE;

    private LocalDateTime dateCreation = LocalDateTime.now();
    private LocalDateTime dateCloture;
    private LocalDateTime dateCommencement;

    // ✅ Ajout de noms uniques pour éviter le conflit Jackson
    @JsonBackReference("user-creePar")
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User creePar;

    @JsonBackReference("user-affecteA")
    @ManyToOne
    @JoinColumn(name = "technicien_id")
    private User affecteA;

    @JsonBackReference("equipement-maintenance")
    @ManyToOne
    @JoinColumn(name = "equipement_id")
    private Equipement equipement;

    @JsonManagedReference("maintenance-interventions")
    @OneToMany(mappedBy = "maintenanceCorrective", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Intervention> interventions;

    @PreUpdate
    public void updateDates() {
        if (this.statut == Statut.TERMINEE || this.statut == Statut.ANNULEE) {
            this.dateCloture = LocalDateTime.now();
        }
        else if(this.statut == Statut.EN_COURS){
                this.dateCommencement = LocalDateTime.now();
            }
        }

    public Long getDuree() {
        if (dateCloture != null && dateCommencement != null) {
            return java.time.Duration.between(dateCommencement, dateCloture).toMinutes();
        }
        return null; // ou 0 si tu préfères
    }



}
