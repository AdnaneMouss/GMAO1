package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Etage;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EtageDTO {

    private Long id;
    private int num; // e.g. "1st Floor"
	private Long batimentId;
    private boolean actif;
	private List<SalleDTO> salles; // List of salles on the Etage

    public EtageDTO(Etage etage) {

        this.id = etage.getId();
        this.num = etage.getNum();
        this.actif = etage.isActif();
		this.batimentId = etage.getBatiment() != null ? etage.getBatiment().getId() : null;
        this.salles = etage.getSalles() != null
                ? etage.getSalles().stream()
                .map(SalleDTO::new)
                .collect(Collectors.toList())
                : null;
    }

    
    
    
}
