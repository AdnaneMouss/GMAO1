package com.huir.GmaoApp.controller;


import com.huir.GmaoApp.dto.*;
import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.repository.BatimentRepository;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.service.BatimentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class BatimentController {

    @Autowired
    private BatimentService batimentService;
    @Autowired
    private BatimentRepository batimentRepository;
    @Autowired
    private EquipementRepository equipementRepository;


    @GetMapping
    public List<BatimentDTO> getBatimentsActifs() {
        return batimentService.getBatimentsActifs().stream()
                .map(BatimentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/inactifs")
    public List<BatimentDTO> getBatimentsInactifs() {
        return batimentService.getBatimentsInactifs().stream()
                .map(BatimentDTO::new)
                .collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public List<BatimentDTO> getBatimentById(@PathVariable("id") Long batimentId) {
        return batimentService.getBatimentById(batimentId).stream()
                .map(BatimentDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{batId}/etages")
    public List<EtageDTO> getEtagesActifsByBatimentId(@PathVariable("batId") Long batId) {
        return batimentService.getEtagesActifsByBatimentId(batId).stream()
                .map(EtageDTO::new)
                .collect(Collectors.toList());
    }


    @GetMapping("/{batId}/etages/inactifs")
    public List<EtageDTO> getEtagesInactifsByBatimentId(@PathVariable("batId") Long batId) {
        return batimentService.getEtagesInactifsByBatimentId(batId).stream()
                .map(EtageDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createBatiment(
            @RequestParam("intitule") String intitule,
            @RequestParam("numBatiment") Integer numBatiment) {

        // Check if a Batiment with the same intitule is already active
        if (batimentService.existsByIntituleAndActifTrue(intitule)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom est déjà utilisé.");
        }

        // Check if a Batiment with the same numBatiment is already active
        if (batimentService.existsByNumAndActifTrue(numBatiment)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce numéro est déjà utilisé.");
        }

        // Create new Batiment
        Batiment batiment = new Batiment();
        batiment.setIntitule(intitule);
        batiment.setNumBatiment(numBatiment);
        batiment.setActif(true);
        // Save the Batiment
        Batiment saved = batimentService.addBatiment(batiment);

        // Return the response with the created BatimentDTO
        return ResponseEntity.ok(new BatimentDTO(saved));
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateBatiment(
            @PathVariable Long id,
            @RequestParam(value = "intitule", required = false) String intitule,
            @RequestParam(value = "numBatiment", required = false) Integer numBatiment,
            @RequestParam(value = "actif", required = false) Boolean actif) {

        Optional<Batiment> existingOpt = batimentRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bâtiment non trouvé.");
        }

        Batiment existing = existingOpt.get();

        // Vérifie le nom s’il a changé et s’il est déjà utilisé par un autre bâtiment actif
        if (intitule != null &&
                !intitule.equals(existing.getIntitule()) &&
                batimentService.existsByIntituleAndActifTrue(intitule)) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "intitule", "message", "Ce nom est déjà utilisé par un autre bâtiment actif."));
        }

        // Vérifie le numéro s’il a changé et s’il est déjà utilisé par un autre bâtiment actif
        if (numBatiment != null &&
                !numBatiment.equals(existing.getNumBatiment()) &&
                batimentService.existsByNumAndActifTrue(numBatiment)) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("field", "numBatiment", "message", "Ce numéro est déjà utilisé par un autre bâtiment actif."));
        }

        // Mise à jour des champs uniquement si les paramètres sont fournis
        if (intitule != null) {
            existing.setIntitule(intitule);
        }
        if (numBatiment != null) {
            existing.setNumBatiment(numBatiment);
        }
        if (actif != null) {
            existing.setActif(actif);
        }

        Batiment updated = batimentRepository.save(existing);
        return ResponseEntity.ok(new BatimentDTO(updated));
    }





    @PutMapping("/{id}/archiver")
    public ResponseEntity<Map<String, String>> archiverBatiment(@PathVariable Long id) {
        Batiment batiment = batimentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bâtiment non trouvé"));

        boolean hasLinkedEquipements = equipementRepository.existsByBatiment(batiment);
        if (hasLinkedEquipements) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible d’archiver : ce bâtiment est lié à au moins un équipement.");
        }

        batiment.setActif(false);
        batimentRepository.save(batiment);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Bâtiment archivé avec succès");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/archiver-multiple")
    public ResponseEntity<Map<String, Object>> archiverBatiments(@RequestBody List<Long> ids) {
        List<Batiment> batiments = batimentRepository.findAllById(ids);
        List<String> archived = new ArrayList<>();
        List<String> skipped = new ArrayList<>();

        for (Batiment batiment : batiments) {
            boolean isLinked = equipementRepository.existsByBatiment(batiment);
            if (isLinked) {
                skipped.add("Bâtiment " + batiment.getIntitule() + " lié à des équipements");
                continue;
            }

            batiment.setActif(false);
            batimentRepository.save(batiment);
            archived.add("Bâtiment ID " + batiment.getId());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("archivés", archived);
        response.put("ignorés", skipped);
        response.put("message", "Archivage terminé avec succès.");

        return ResponseEntity.ok(response);
    }



    @PutMapping("/{id}/restaurer")
    public ResponseEntity<?> restaurerBatiment(@PathVariable Long id) {
        Batiment batiment = batimentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bâtiment non trouvé"));

        // Check if another *actif* batiment has the same name or number
        if (batimentService.existsByIntituleAndActifTrue(batiment.getIntitule())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Un bâtiment actif avec ce nom existe déjà.");
        }

        if (batimentService.existsByNumAndActifTrue(batiment.getNumBatiment())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Un bâtiment actif avec ce numéro existe déjà.");
        }

        // If checks pass, restore the batiment
        batiment.setActif(true);
        batimentRepository.save(batiment);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Bâtiment restauré avec succès");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/restaurer-multiple")
    public ResponseEntity<?> restaurerBatiments(@RequestBody List<Long> ids) {
        List<Batiment> batiments = batimentRepository.findAllById(ids);
        List<String> conflicts = new ArrayList<>();

        for (Batiment batiment : batiments) {
            if (batimentService.existsByIntituleAndActifTrue(batiment.getIntitule())) {
                conflicts.add("Nom déjà utilisé : " + batiment.getIntitule());
                continue;
            }

            if (batimentService.existsByNumAndActifTrue(batiment.getNumBatiment())) {
                conflicts.add("Numéro déjà utilisé : " + batiment.getNumBatiment());
                continue;
            }

            batiment.setActif(true);
        }

        // Only save if there are no conflicts
        if (!conflicts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(conflicts);
        }

        batimentRepository.saveAll(batiments);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Bâtiments restaurés avec succès");
        return ResponseEntity.ok(response);
    }


}
