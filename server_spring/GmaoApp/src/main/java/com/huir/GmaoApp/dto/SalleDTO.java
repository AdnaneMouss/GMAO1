package com.huir.GmaoApp.dto;

import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalleDTO {

    private Long id;
    private int num; // e.g. "Room 101"
    private Etage etage;

    public SalleDTO(Salle salle) {

        this.id = salle.getId();
        this.num = salle.getNum();
        this.etage = salle.getEtage();

    }
}
