package com.huir.GmaoApp.controller;


import com.huir.GmaoApp.dto.*;
import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.service.BatimentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class BatimentController {

    @Autowired
    private BatimentService batimentService;


    @GetMapping
    public List<BatimentDTO> getAllBatiments() {
        return batimentService.getAllBatiments().stream()
                .map(BatimentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{batId}/etages")
    public List<EtageDTO> getEtagesByBatimentId(@PathVariable("batId") Long typeId) {
        return batimentService.getEtagesByBatimentId(typeId).stream()
                .map(EtageDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createBatiment(@RequestBody BatimentDTO batimentDTO) {
        if (batimentService.existsByIntitule(batimentDTO.getIntitule())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom est déjà utilisé.");
        }
        if (batimentService.existsByNum(batimentDTO.getNumBatiment())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce numéro est déjà utilisé.");
        }

        Batiment batiment = new Batiment();
        batiment.setIntitule(batimentDTO.getIntitule());
        batiment.setNumBatiment(batimentDTO.getNumBatiment());
        Batiment saved = batimentService.addBatiment(batiment);
        return ResponseEntity.ok(new BatimentDTO(saved));
    }


}
