package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.PieceDetacheeDTO;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.service.EquipementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/equipements")
@CrossOrigin(origins = "http://localhost:4200")
public class EquipementController {

    @Autowired
    private EquipementService equipementService;
    @Autowired
    private  EquipementRepository equipementRepository;
    // Get all equipment


    @GetMapping("/bySalle/{salleId}")
    public List<Equipement> getEquipementsBySalle(@PathVariable Long salleId) {
        return equipementService.getEquipementsBySalle(salleId);
    }

    @GetMapping
    public List<EquipementDTO> getAllEquipements() {
        return equipementService.findAllEquipements().stream()
                .map(EquipementDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/pieces")
    public List<PieceDetacheeDTO> getPiecesDetachees(@PathVariable("id") long equipementId) {
        return equipementService.getPiecesDetacheesByEquipementId(equipementId).stream()
                .map(PieceDetacheeDTO::new)  // Assuming you have a PieceDetacheeDTO constructor that accepts a PieceDetachee
                .collect(Collectors.toList());
    }

    @GetMapping("/service/{serviceId}")
    public List<Equipement> getEquipementsByService(@PathVariable Long serviceId) {
        return equipementRepository.findByServiceId(serviceId);
    }



 /*   @PostMapping("/create")
    public ResponseEntity<Equipement> createEquipement(@RequestBody EquipementDTO equipementDTO) {
        Equipement savedEquipement = equipementService.saveEquipement(equipementDTO);
        return ResponseEntity.ok(savedEquipement);
    }
*/

    @GetMapping("/{id}")
    public Optional<EquipementDTO> getEquipementById(@PathVariable("id") Long equipementId) {
        // Fetch the Equipement data by ID
        Optional<Equipement> equipement = equipementService.findEquipementById(equipementId);

        return equipement.map(EquipementDTO::new);
    }

    @PutMapping("/{id}")
    public EquipementDTO updateUser(@PathVariable Long id, @RequestBody EquipementDTO equipementDTO) {
        return equipementService.updateEquipement(id, equipementDTO);
    }


    // Delete equipment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipement(@PathVariable Long id) {
        equipementService.deleteEquipement(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/attributs")
    public ResponseEntity<List<AttributEquipements>> getAttributsByEquipementId(@PathVariable Long id) {
        List<AttributEquipements> attributs = equipementService.getAttributsByEquipementId(id);
        return ResponseEntity.ok(attributs);
    }
}



