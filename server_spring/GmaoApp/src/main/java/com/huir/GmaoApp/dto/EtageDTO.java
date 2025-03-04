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
    private Batiment batiment;
    private List<SalleDTO> salles; // List of salles on the Etage

    public EtageDTO(Etage etage) {

        this.id = etage.getId();
        this.num = etage.getNum();
        this.batiment = etage.getBatiment();
        this.salles = etage.getSalles() != null
                ? etage.getSalles().stream()
                .map(SalleDTO::new)
                .collect(Collectors.toList())
                : null;
    }
}
