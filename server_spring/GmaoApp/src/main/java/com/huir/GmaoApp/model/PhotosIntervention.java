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
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;
    
    
    
    @ManyToOne
    @JoinColumn(name = "intervention_preventive_id")
    private InterventionPreventive interventionPreventive;


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Intervention getIntervention() {
		return intervention;
	}

	public void setIntervention(Intervention intervention) {
		this.intervention = intervention;
	}

	public InterventionPreventive getInterventionPreventive() {
		return interventionPreventive;
	}

	public void setInterventionPreventive(InterventionPreventive interventionPreventive) {
		this.interventionPreventive = interventionPreventive;
	}
    
    
    
}
