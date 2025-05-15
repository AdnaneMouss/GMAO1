package com.huir.GmaoApp.controller;


import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.EtageDTO;
import com.huir.GmaoApp.dto.SalleDTO;
import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import com.huir.GmaoApp.repository.BatimentRepository;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.EtageRepository;
import com.huir.GmaoApp.repository.SallesRepository;
import com.huir.GmaoApp.service.EtageService;
import com.huir.GmaoApp.service.SalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
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
    @Autowired
    private SallesRepository salleRepository;
    @Autowired
    private EquipementRepository equipementRepository;


    @GetMapping("/{id}")
    public Optional<SalleDTO> getSalleById(@PathVariable("id") Long salleId) {
        Optional<Salle> salle = salleService.findSalleById(salleId);

        return salle.map(SalleDTO::new);
    }

    @PostMapping
    public ResponseEntity<?> createSalle(
            @RequestParam("num") Integer num,
            @RequestParam("prefixe") String prefixe,
            @RequestParam("etageId") Long etageId) {

        // Check if the Salle with the given number and EtageId already exists
        if (salleService.existsByPrefixeAndNumAndEtageIdAndActifTrue(prefixe,num, etageId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Cette existe déjà dans ce cet étage.");
        }

        // Create a new Salle object and set its properties
        Salle salle = new Salle();
        salle.setNum(num);
        salle.setPrefixe(prefixe);

        // Fetch the Etage using the etageId and set it to the Salle
        Etage etage = etageRepository.findById(etageId)
                .orElseThrow(() -> new RuntimeException("Etage non trouvé avec ID : " + etageId));
        salle.setEtage(etage);

        // Save the new Salle to the database
        Salle savedSalle = salleService.saveSalle(salle);

        // Convert the saved Salle back to SalleDTO for the response
        SalleDTO responseDTO = new SalleDTO(savedSalle);

        return ResponseEntity.ok(responseDTO);  // Return the saved SalleDTO as the response
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSalle(
            @PathVariable Long id,
            @RequestParam("num") Integer num,
            @RequestParam("prefixe") String prefixe,
            @RequestParam("etageId") Long etageId) {

        // Fetch the Salle object by ID
        Optional<Salle> existingSalleOpt = salleRepository.findById(id);
        if (existingSalleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Salle non trouvée.");
        }

        Salle existingSalle = existingSalleOpt.get();

        // Check if the Salle with the given number already exists in the same Etage
        if (salleService.existsByPrefixeAndNumAndEtageIdAndActifTrue(prefixe, num, etageId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ce numéro d'étage existe déjà dans ce bâtiment.");
        }

        // Fetch the Etage using the etageId and set it to the Salle
        Etage etage = etageRepository.findById(etageId)
                .orElseThrow(() -> new RuntimeException("Etage non trouvé avec ID : " + etageId));
        existingSalle.setEtage(etage);

        // Update the Salle fields
        existingSalle.setNum(num);
        existingSalle.setPrefixe(prefixe);

        // Save the updated Salle back to the database
        Salle updatedSalle = salleRepository.save(existingSalle);

        // Convert the updated Salle to SalleDTO for the response
        SalleDTO responseDTO = new SalleDTO(updatedSalle);

        return ResponseEntity.ok(responseDTO);  // Return the updated SalleDTO as the response
    }


    @PutMapping("/{id}/archiver")
    public ResponseEntity<Map<String, String>> archiverSalle(@PathVariable Long id) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Salle non trouvée"));

        // Check if there are any Equipements linked to this Salle
        boolean isLinked = equipementRepository.existsBySalle(salle);
        if (isLinked) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible d’archiver : La salle est liée à des équipements.");
        }

        salle.setActif(false);
        salleRepository.save(salle);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Salle archivée avec succès");
        return ResponseEntity.ok(response);
    }


    @PutMapping("/archiver-multiple")
    public ResponseEntity<?> archiverSalles(@RequestBody List<Long> ids) {
        List<Salle> salles = salleRepository.findAllById(ids);

        if (salles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aucune salle trouvée pour les IDs donnés.");
        }

        List<String> linkedSalles = new ArrayList<>();

        for (Salle salle : salles) {
            if (equipementRepository.existsBySalle(salle)) {
                linkedSalles.add("Salle '" + salle.getPrefixe() + salle.getNum() + "' est liée à des équipements");
            }
        }

        if (!linkedSalles.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Archivage impossible :\n" + String.join("\n", linkedSalles)
            );
        }

        for (Salle salle : salles) {
            salle.setActif(false);
            salleRepository.save(salle);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Toutes les salles ont été archivées avec succès.");
        response.put("archivées", salles.stream().map(salle -> "Salle ID " + salle.getId()).toList());

        return ResponseEntity.ok(response);
    }



    @PutMapping("/{id}/restaurer")
    public ResponseEntity<Map<String, String>> restaurerSalle(@PathVariable Long id) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Salle non trouvée"));

        salle.setActif(true);
        salleRepository.save(salle);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Salle restaurée avec succès");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/restaurer-multiple")
    public ResponseEntity<?> restaurerSalles(@RequestBody List<Long> ids) {
        List<Salle> salles = salleRepository.findAllById(ids);
        List<String> conflicts = new ArrayList<>();

        for (Salle salle : salles) {
            if (salleService.existsByPrefixeAndNumAndEtageIdAndActifTrue(salle.getPrefixe(), salle.getNum(), salle.getEtage().getId())) {
                conflicts.add("Nom déjà utilisé : Salle '" + salle.getNum() +
                        "' sur l'étage '" + salle.getEtage().getNum() + "'");
                continue;
            }

            salle.setActif(true);
        }

        if (!conflicts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(conflicts);
        }

        salleRepository.saveAll(salles);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Salles restaurées avec succès");
        return ResponseEntity.ok(response);
    }


}
