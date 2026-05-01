package com.huir.GmaoApp.controller;


import com.huir.GmaoApp.dto.AttributEquipementsDTO;
import com.huir.GmaoApp.dto.BatimentDTO;
import com.huir.GmaoApp.dto.EtageDTO;
import com.huir.GmaoApp.dto.SalleDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.BatimentRepository;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.EtageRepository;
import com.huir.GmaoApp.service.BatimentService;
import com.huir.GmaoApp.service.EtageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/etage")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class EtageController {

    @Autowired
    private EtageService etageService;
    @Autowired
    private EtageRepository etageRepository;
    @Autowired
    private BatimentRepository batimentRepository;
    @Autowired
    private EquipementRepository equipementRepository;

    @GetMapping("/{etageId}/salles")
    public List<SalleDTO> getSallesActivesByEtageId(@PathVariable("etageId") Long etageId) {
        return etageService.getSallesActivesByEtageId(etageId).stream()
                .map(SalleDTO::new)
                .collect(Collectors.toList());
    }


    @GetMapping("/{etageId}/salles/inactifs")
    public List<SalleDTO> getSallesInactivesByEtageId(@PathVariable("etageId") Long etageId) {
        return etageService.getSallesInactivesByEtageId(etageId).stream()
                .map(SalleDTO::new)
                .collect(Collectors.toList());
    }


    @PostMapping
    public ResponseEntity<?> createEtage(
            @RequestParam("num") Integer num,
            @RequestParam("batimentId") Long batimentId) {

        // Check if the Etage with the given number and batimentId already exists
        if (etageService.existsByNumAndBatimentIdAndActifTrue(num, batimentId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ce numéro d'étage existe déjà dans ce bâtiment.");
        }

        // Create a new Etage object and set its properties
        Etage etage = new Etage();
        etage.setNum(num);

        // Fetch the Batiment using the batimentId and set it to the Etage
        Batiment batiment = batimentRepository.findById(batimentId)
                .orElseThrow(() -> new RuntimeException("Batiment non trouvé avec ID : " + batimentId));
        etage.setBatiment(batiment);

        // Save the new Etage to the database
        Etage savedEtage = etageService.saveEtage(etage);

        // Convert the saved Etage back to EtageDTO for the response
        EtageDTO responseDTO = new EtageDTO(savedEtage);

        return ResponseEntity.ok(responseDTO);  // Return the saved EtageDTO as the response
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEtage(
            @PathVariable Long id,
            @RequestParam("num") Integer num,
            @RequestParam("batimentId") Long batimentId) {

        // Find the existing Etage by ID
        Optional<Etage> existingEtageOpt = etageRepository.findById(id);
        if (existingEtageOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Étage non trouvé.");
        }

        Etage existingEtage = existingEtageOpt.get();

        // Check if the Etage with the given number and batimentId already exists
        if (etageService.existsByNumAndBatimentIdAndActifTrue(num, batimentId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ce numéro d'étage existe déjà dans ce bâtiment.");
        }

        // Update the Etage properties
        existingEtage.setNum(num);

        // Fetch the Batiment using the batimentId and set it to the Etage
        Batiment batiment = batimentRepository.findById(batimentId)
                .orElseThrow(() -> new RuntimeException("Batiment non trouvé avec ID : " + batimentId));
        existingEtage.setBatiment(batiment);

        // Save the updated Etage
        Etage updatedEtage = etageService.saveEtage(existingEtage);

        // Convert the updated Etage to EtageDTO for the response
        EtageDTO responseDTO = new EtageDTO(updatedEtage);

        return ResponseEntity.ok(responseDTO);  // Return the updated EtageDTO as the response
    }




    @GetMapping("/{id}")
    public List<EtageDTO> getEtageById(@PathVariable("id") Long etageId) {
        return etageService.getEtageById(etageId).stream()
                .map(EtageDTO::new)
                .collect(Collectors.toList());
    }


    @PutMapping("/{id}/archiver")
    public ResponseEntity<Map<String, String>> archiverEtage(@PathVariable Long id) {
        Etage etage = etageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étage non trouvé"));

        boolean isLinked = equipementRepository.existsByEtage(etage);
        if (isLinked) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible d’archiver : l’étage est lié à des équipements.");
        }

        etage.setActif(false);
        etageRepository.save(etage);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Étage archivé avec succès");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/archiver-multiple")
    public ResponseEntity<?> archiverEtages(@RequestBody List<Long> ids) {
        List<Etage> etages = etageRepository.findAllById(ids);

        if (etages.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucun étage trouvé pour les IDs donnés.");
        }

        List<String> linkedEtages = new ArrayList<>();

        for (Etage etage : etages) {
            if (equipementRepository.existsByEtage(etage)) {
                linkedEtages.add("Étage '" + etage.getNum() + "' est lié à des équipements");
            }
        }

        if (!linkedEtages.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Archivage impossible :\n" + String.join("\n", linkedEtages)
            );
        }

        for (Etage etage : etages) {
            etage.setActif(false);
            etageRepository.save(etage);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tous les étages ont été archivés avec succès.");
        response.put("archivés", etages.stream().map(Etage::getNum).toList());

        return ResponseEntity.ok(response);
    }


    @PutMapping("/{id}/restaurer")
    public ResponseEntity<Map<String, String>> restaurerEtage(@PathVariable Long id) {
        Etage etage = etageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étage non trouvé"));

        etage.setActif(true);
        etageRepository.save(etage);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Étage restauré avec succès");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/restaurer-multiple")
    public ResponseEntity<?> restaurerEtages(@RequestBody List<Long> ids) {
        List<Etage> etages = etageRepository.findAllById(ids);
        List<String> conflicts = new ArrayList<>();

        for (Etage etage : etages) {
            // Assuming you have a similar check method in etageService
            if (etageService.existsByNumAndBatimentIdAndActifTrue(etage.getNum(), etage.getBatiment().getId())) {
                conflicts.add("Conflit de nom pour l'étage : " + etage.getNum() + " dans le bâtiment " + etage.getBatiment().getIntitule());
                continue;
            }

            etage.setActif(true);
        }

        if (!conflicts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(conflicts);
        }

        etageRepository.saveAll(etages);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Étages restaurés avec succès");
        return ResponseEntity.ok(response);
    }


}
