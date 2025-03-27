package com.huir.GmaoApp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "photo_interventions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotosIntervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // URL de l'image si stockée sur un serveur externe (S3, disque local, etc.)
    @Column(nullable = false)
    private String url;

    @ManyToOne
    @JoinColumn(name = "intervention_id", nullable = false)
    private Intervention intervention;
}
