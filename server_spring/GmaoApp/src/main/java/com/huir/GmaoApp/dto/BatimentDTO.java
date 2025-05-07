package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Batiment;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatimentDTO {

    private Long id;
    private Integer numBatiment;
    private String intitule;
    private Boolean actif;
    private List<EtageDTO> etages;

    public BatimentDTO(Batiment batiment) {
        this.id = batiment.getId();
        this.numBatiment = batiment.getNumBatiment();
        this.intitule = batiment.getIntitule();
        this.actif = batiment.getActif();
        this.etages = batiment.getEtages() != null
                ? batiment.getEtages().stream()
                .map(EtageDTO::new)
                .collect(Collectors.toList())
                : null;
    }


}
