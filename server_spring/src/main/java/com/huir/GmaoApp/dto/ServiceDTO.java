package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Services;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDTO {
    private Long id;
    private String nom;
    private String image;
    private String description;
    private List<EquipementDTO> equipements;

    public ServiceDTO(Services services) {
        this.id = services.getId();
        this.nom = services.getNom();
        this.description = services.getDescription();
        this.image = services.getImage();
        this.equipements = services.getEquipements() != null
                ? services.getEquipements().stream()
                .map(EquipementDTO::new)
                .collect(Collectors.toList())
                : null;
    }
}
