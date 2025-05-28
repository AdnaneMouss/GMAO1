package com.huir.GmaoApp.service;


import com.huir.GmaoApp.dto.AttributEquipementValeurDTO;
import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EquipementService {

    @Autowired
    private EquipementRepository equipementRepository;

    @Autowired
    private ServicesRepository serviceRepository;

    @Autowired
    private TypesEquipementsRepository typeEquipementRepository;

    @Autowired
    private SallesRepository salleRepository;

    @Autowired
    private EtageRepository etageRepository;

    @Autowired
    private BatimentRepository batimentRepository;

    @Autowired
    private AttributEquipementsValeursRepository attributEquipementsValeursRepository;
    @Autowired
    private AttributEquipementsRepository attributEquipementsRepository;


    public List<Equipement> getEquipementsBySalle(Long salleId) {
        return equipementRepository.findBySalleIdAndActifTrue(salleId);
    }

    public List<Equipement> getEquipementsByService(Long serviceId) {
        return equipementRepository.findByServiceIdAndActifTrue(serviceId);
    }


    public Map<String, String> getAttributsByEquipement(Long equipementId) {
        Map<String, String> attributsValeurs = new HashMap<>();

        Equipement equipement = equipementRepository.findById(equipementId)
                .orElseThrow(() -> new RuntimeException("Équipement non trouvé"));

        // Retrieve all values at once (avoid multiple DB queries)
        List<AttributEquipementValeur> valeurs = attributEquipementsValeursRepository.findByEquipement(equipement);
        Map<AttributEquipements, String> valeursMap = valeurs.stream()
                .collect(Collectors.toMap(AttributEquipementValeur::getAttributEquipement, AttributEquipementValeur::getValeur));

        for (AttributEquipements attribut : equipement.getTypeEquipement().getAttributs()) {
            attributsValeurs.put(attribut.getNom(), valeursMap.getOrDefault(attribut, "Non défini"));
        }

        return attributsValeurs;
    }
    public Equipement saveEquipementDetails(
            Equipement equipement,
            String typeEquipementNom,
            String serviceNom,
            String batimentNom,
            Integer etageNum,
            Integer salleNum,
            Map<Long, String> attributsValeurs  // Map<attributEquipementId, valeur>
    ) {

        // Set TypeEquipement
        TypesEquipements typeEquipement = typeEquipementRepository.findByType(typeEquipementNom)
                .orElseThrow(() -> new RuntimeException("TypeEquipement not found"));
        equipement.setTypeEquipement(typeEquipement);

        // Set Service if present
        if (serviceNom != null) {
            Services service = serviceRepository.findByNom(serviceNom);
            equipement.setService(service);
        }

        // Set Batiment if present
        if (batimentNom != null) {
            Batiment batiment = batimentRepository.findByIntitule(batimentNom);
            equipement.setBatiment(batiment);
        }

        // Set Etage if present
        if (etageNum != null && batimentNom != null) {
            Etage etage = etageRepository.findByNumAndBatimentIntitule(etageNum, batimentNom);
            equipement.setEtage(etage);
        }

        // Set Salle if present
        if (salleNum != null && etageNum != null) {
            Salle salle = salleRepository.findByNumAndEtageNum(salleNum, etageNum);
            equipement.setSalle(salle);
        }

        equipement.setDateMiseEnService(LocalDateTime.now());

        // Save Equipement first to get the ID
        Equipement savedEquipement = equipementRepository.save(equipement);

        // Fetch all AttributEquipement for this TypeEquipement
        List<AttributEquipements> attributs = attributEquipementsRepository.findByTypeEquipement(typeEquipement);

        // Loop through attributsValeurs map to create/update AttributValeur
        for (AttributEquipements attribut : attributs) {
            Long attrId = attribut.getId();
            if (attributsValeurs != null && attributsValeurs.containsKey(attrId)) {
                String valeur = attributsValeurs.get(attrId);

                // Find existing AttributValeur if exists
                Optional<AttributEquipementValeur> existingValeurOpt = attributEquipementsValeursRepository
                        .findByEquipementAndAttributEquipement(savedEquipement, attribut);

                AttributEquipementValeur attributValeur;
                if (existingValeurOpt.isPresent()) {
                    attributValeur = existingValeurOpt.get();
                    attributValeur.setValeur(valeur);
                } else {
                    attributValeur = new AttributEquipementValeur();
                    attributValeur.setEquipement(savedEquipement);
                    attributValeur.setAttributEquipement(attribut);
                    attributValeur.setValeur(valeur);
                }
                attributEquipementsValeursRepository.save(attributValeur);
            }
        }

        return savedEquipement;
    }


    public Optional<Equipement> findEquipementById(Long id) {
        return equipementRepository.findById(id);
    }


    // Get all equipment
    public List<Equipement> findAllEquipements() {
        return equipementRepository.findAll();
    }

    // Delete an equipment
    public void deleteEquipement(Long id) {
        equipementRepository.deleteById(id);
    }


    public List<AttributEquipements> getAttributsByEquipementId(Long equipementId) {
        Optional<Equipement> equipementOpt = equipementRepository.findById(equipementId);
        if (equipementOpt.isPresent()) {
            TypesEquipements type = equipementOpt.get().getTypeEquipement();
            return type.getAttributs(); // assuming it's fetched correctly
        } else {
            throw new EntityNotFoundException("Equipement not found");
        }
    }


    public boolean existsByNumeroSerie(String numeroSerie) {
        return equipementRepository.existsByNumeroSerie(numeroSerie);
    }
}
