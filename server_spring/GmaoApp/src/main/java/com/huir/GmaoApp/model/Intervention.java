package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interventions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // L'intervention est réalisée par un technicien spécifique
    @JsonBackReference("user-intervention")
    @ManyToOne
    @JoinColumn(name = "technicien_id", nullable = false)
    private User technicien;

    // Type de l'intervention (préventive, corrective, etc.)
    @Enumerated(EnumType.STRING)
    private TypeIntervention type;

    // Description détaillée de l'intervention réalisée
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Transient
    private Long duree;

    public Long getDuree() {
        if (maintenanceCorrective != null) {
            return maintenanceCorrective.getDuree();
        }
        return null;
    }


    // Lien avec la maintenance corrective si applicable
    @JsonBackReference("maintenance-intervention")
    @ManyToOne
    @JoinColumn(name = "maintenance_id", nullable = false)
    private MaintenanceCorrective maintenanceCorrective;

    // Commentaires du technicien après l'intervention
    @Column(columnDefinition = "TEXT")
    private String remarques;

    // Preuve de l'intervention (photos avant/après)
    @OneToMany(mappedBy = "intervention", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PhotosIntervention> photos;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
			name = "intervention_piece_detachee",
			joinColumns = @JoinColumn(name = "intervention_id"),
			inverseJoinColumns = @JoinColumn(name = "piece_detachee_id")
	)
    @JsonManagedReference(value = "intervention-piece")
	private List<PieceDetachee> piecesDetachees;

}
