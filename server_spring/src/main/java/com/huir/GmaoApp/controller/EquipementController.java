package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.Attribut;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.service.EquipementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping
    public List<EquipementDTO> getAllEquipements() {
        return equipementService.findAllEquipements().stream()
                .map(EquipementDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/service/{serviceId}")
    public List<Equipement> getEquipementsByService(@PathVariable Long serviceId) {
        return equipementRepository.findByServiceId(serviceId);
    }

    @PostMapping
    public ResponseEntity<EquipementDTO> createEquipement(@RequestBody EquipementDTO equipementDTO) {
        Equipement equipement = new Equipement();

        equipement.setNom(equipementDTO.getNom());
        equipement.setDescription(equipementDTO.getDescription());
        equipement.setImage(equipementDTO.getImage());
        equipement.setNumeroSerie(equipementDTO.getNumeroSerie());
        equipement.setModele(equipementDTO.getModele());
        equipement.setMarque(equipementDTO.getMarque());
        equipement.setLocalisation(equipementDTO.getLocalisation());
        equipement.setStatut(equipementDTO.getStatut());
        equipement.setDateAchat(equipementDTO.getDateAchat());
        equipement.setDateMiseEnService(equipementDTO.getDateMiseEnService());
        equipement.setGarantie(equipementDTO.getGarantie());
        equipement.setDateDerniereMaintenance(equipementDTO.getDateDerniereMaintenance());
        equipement.setFrequenceMaintenance(equipementDTO.getFrequenceMaintenance());
        equipement.setHistoriquePannes(equipementDTO.getHistoriquePannes());
        equipement.setCoutAchat(equipementDTO.getCoutAchat());

        // Handling dynamic attributes
        List<Attribut> attributs = equipementDTO.getAttributs().stream()
                .map(attrDTO -> {
                    Attribut attribut = new Attribut();
                    attribut.setNom(attrDTO.getNom());
                    attribut.setValeur(attrDTO.getValeur());
                    attribut.setEquipement(equipement);
                    return attribut;
                })
                .collect(Collectors.toList());

        equipement.setAttributs(attributs);

        // Save the Equipement entity
        Equipement savedEquipement = equipementService.saveEquipement(equipement);

        // Return the DTO of the saved equipement
        EquipementDTO responseDTO = new EquipementDTO(savedEquipement);
        return ResponseEntity.ok(responseDTO);
    }

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
}



