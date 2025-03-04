package com.huir.GmaoApp.controller;


import com.huir.GmaoApp.dto.EtageDTO;
import com.huir.GmaoApp.dto.SalleDTO;
import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import com.huir.GmaoApp.repository.BatimentRepository;
import com.huir.GmaoApp.repository.EtageRepository;
import com.huir.GmaoApp.service.EtageService;
import com.huir.GmaoApp.service.SalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/salle")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SalleController {

    @Autowired
    private SalleService salleService;
    @Autowired
    private EtageRepository etageRepository;


    @PostMapping
    public ResponseEntity<?> createSalle(@RequestBody SalleDTO salleDTO) {

        if (salleService.existsByNumAndEtageId(salleDTO.getNum(), salleDTO.getEtage().getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ce numéro d'étage existe déjà dans ce bâtiment.");
        }

        Salle salle = new Salle();
        salle.setNum(salleDTO.getNum());


        if (salleDTO.getEtage() != null && salleDTO.getEtage().getId() != null) {
            Etage etage = etageRepository.findById(salleDTO.getEtage().getId())
                    .orElseThrow(() -> new RuntimeException("Etage non trouvé avec ID : " + salle.getEtage().getId()));
            salle.setEtage(etage);
        }

        Salle savedSalle = salleService.saveSalle(salle);

        SalleDTO responseDTO = new SalleDTO(savedSalle);
        return ResponseEntity.ok(responseDTO);
    }


}
