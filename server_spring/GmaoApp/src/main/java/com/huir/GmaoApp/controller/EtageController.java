package com.huir.GmaoApp.controller;


import com.huir.GmaoApp.dto.AttributEquipementsDTO;
import com.huir.GmaoApp.dto.BatimentDTO;
import com.huir.GmaoApp.dto.EtageDTO;
import com.huir.GmaoApp.dto.SalleDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.BatimentRepository;
import com.huir.GmaoApp.service.BatimentService;
import com.huir.GmaoApp.service.EtageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/etage")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class EtageController {

    @Autowired
    private EtageService etageService;
    @Autowired
    private BatimentRepository batimentRepository;

    @GetMapping("/{etageId}/salles")
    public List<SalleDTO> getSallesByEtageId(@PathVariable("etageId") Long typeId) {
        return etageService.getSallesByEtageId(typeId).stream()
                .map(SalleDTO::new)
                .collect(Collectors.toList());
    }


    @PostMapping
    public ResponseEntity<?> createEtage(@RequestBody EtageDTO etageDTO) {

        if (etageService.existsByNumAndBatimentId(etageDTO.getNum(), etageDTO.getBatiment().getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ce numéro d'étage existe déjà dans ce bâtiment.");
        }

        Etage etage = new Etage();
        etage.setNum(etageDTO.getNum());


        if (etageDTO.getBatiment() != null && etageDTO.getBatiment().getId() != null) {
            Batiment batiment = batimentRepository.findById(etageDTO.getBatiment().getId())
                    .orElseThrow(() -> new RuntimeException("Batiment non trouvé avec ID : " + etage.getBatiment().getId()));
            etage.setBatiment(batiment);
        }

        Etage savedEtage = etageService.saveEtage(etage);

        EtageDTO responseDTO = new EtageDTO(savedEtage);
        return ResponseEntity.ok(responseDTO);
    }


}
