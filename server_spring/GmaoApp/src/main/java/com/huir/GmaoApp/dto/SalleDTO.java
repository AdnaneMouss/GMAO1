package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalleDTO {

    private Long id;
    private String prefixe;
    private int num; // e.g. "Room 101"
    private Etage etage;
    private Boolean actif;
    private List<EquipementDTO> equipement;
    public SalleDTO(Salle salle) {

        this.id = salle.getId();
        this.prefixe = salle.getPrefixe();
        this.num = salle.getNum();
        this.actif=salle.isActif();
        this.etage = salle.getEtage();
        this.equipement = salle.getEquipement() != null
                ? salle.getEquipement().stream()
                .map(EquipementDTO::new)
                .collect(Collectors.toList())
                : null;
    }
}
