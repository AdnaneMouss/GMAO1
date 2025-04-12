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
        return equipementRepository.findBySalleId(salleId);
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

    public Equipement saveEquipement(EquipementDTO equipementDTO) {
        // Create Equipement entity from DTO
        Equipement equipement = Equipement.builder()
                .nom(equipementDTO.getNom())
                .description(equipementDTO.getDescription())
                .numeroSerie(equipementDTO.getNumeroSerie())
                .modele(equipementDTO.getModele())
                .marque(equipementDTO.getMarque())
                .statut(equipementDTO.getStatut())
                .dateAchat(equipementDTO.getDateAchat())
                .garantie(equipementDTO.getGarantie())
                .frequenceMaintenance(equipementDTO.getFrequenceMaintenance())
                .coutAchat(equipementDTO.getCoutAchat())
                .labelSuivi(equipementDTO.getLabelSuivi())
                .valeurSuivi(equipementDTO.getValeurSuivi())
                .build();

        // Set typeEquipement using DTO field
        Optional<TypesEquipements> typeEquipement = typeEquipementRepository.findByType(equipementDTO.getTypeEquipement());
        equipement.setTypeEquipement(typeEquipement.get());

        // Set service, responsableMaintenance, salle, etage, batiment using the relevant relationships
        if (equipementDTO.getServiceNom() != null) {
            Services service = serviceRepository.findByNom(equipementDTO.getServiceNom());
            equipement.setService(service);
        }

        // Fetch and set Batiment, Etage, and Salle based on DTO
        if (equipementDTO.getBatimentNom() != null) {
            Batiment batiment = batimentRepository.findByIntitule(equipementDTO.getBatimentNom());
            equipement.setBatiment(batiment);
        }

        if (equipementDTO.getEtageNum() != null && equipementDTO.getBatimentNom() != null) {
            Etage etage = etageRepository.findByNumAndBatimentIntitule(
                    equipementDTO.getEtageNum(),
                    equipementDTO.getBatimentNom()
            );
            equipement.setEtage(etage);
        }

        if (equipementDTO.getSalleNum() != null) {
            Salle salle = salleRepository.findByNumAndEtageNum(
                    equipementDTO.getSalleNum(),
                    equipementDTO.getEtageNum());
            equipement.setSalle(salle);
        }


        // Save Equipement entity
        Equipement savedEquipement = equipementRepository.save(equipement);

        // Process dynamic attributes (AttributEquipementValeur)
        if (equipementDTO.getAttributs() != null && !equipementDTO.getAttributs().isEmpty()) {
            List<AttributEquipementValeur> attributEquipementValeurs = equipementDTO.getAttributs().stream()
                    .map(dto -> {
                        // Fetch AttributEquipement and TypesEquipements based on DTO info (assuming the DTO has necessary identifiers)
                        AttributEquipements attributEquipement = attributEquipementsRepository.findById(dto.getAttributEquipementId())
                                .orElseThrow(() -> new RuntimeException("AttributEquipement not found"));
                        TypesEquipements typesEquipement = typeEquipementRepository.findById(dto.getTypesEquipementId())
                                .orElseThrow(() -> new RuntimeException("TypesEquipement not found"));

                        // Create new AttributEquipementValeur instance
                        return AttributEquipementValeur.builder()
                                .valeur(dto.getValeur())
                                .attributEquipement(attributEquipement)
                                .typeEquipement(typesEquipement)
                                .equipement(savedEquipement)  // Link the saved Equipement
                                .build();
                    })
                    .collect(Collectors.toList());

            // Save dynamic attributes
            attributEquipementsValeursRepository.saveAll(attributEquipementValeurs);
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

    @Transactional
    public EquipementDTO updateEquipement(Long id, EquipementDTO equipementDTO) {
        Optional<Equipement> optionalEquipement = equipementRepository.findById(id);
        if (optionalEquipement.isPresent()) {
            Equipement equipement = optionalEquipement.get();

            // Update equipement fields using equipementDTO values
            equipement.setNom(equipementDTO.getNom());
            equipement.setDescription(equipementDTO.getDescription());
            equipement.setNumeroSerie(equipementDTO.getNumeroSerie());
            equipement.setModele(equipementDTO.getModele());
            equipement.setMarque(equipementDTO.getMarque());
            equipement.setStatut(equipementDTO.getStatut());
            equipement.setDateAchat(equipementDTO.getDateAchat());
            equipement.setDateMiseEnService(equipementDTO.getDateMiseEnService());
            equipement.setGarantie(equipementDTO.getGarantie());
            equipement.setDateDerniereMaintenance(equipementDTO.getDateDerniereMaintenance());
            equipement.setFrequenceMaintenance(equipementDTO.getFrequenceMaintenance());
            equipement.setHistoriquePannes(equipementDTO.getHistoriquePannes());
            equipement.setCoutAchat(equipementDTO.getCoutAchat());
            equipement.setImage(equipementDTO.getImage());
            
            equipement.setLabelSuivi(equipementDTO.getLabelSuivi());
            equipement.setValeurSuivi(equipementDTO.getValeurSuivi());
            

            // Update the service and responsable maintenance 
            if (!equipementDTO.getServiceNom().isEmpty()) {
                Services service = serviceRepository.findByNom(equipementDTO.getServiceNom());
                if (service == null) {
                    throw new EntityNotFoundException("Service '" + equipementDTO.getServiceNom() + "' not found in the database");
                }
                equipement.setService(service);
            }

           /* if (equipementDTO.getResponsableMaintenanceNom() != null) {
                equipement.setResponsableMaintenance(responsableRepository.findByNom(equipementDTO.getResponsableMaintenanceNom()));
            }

            // Update ordresTravail (if applicable)
            if (equipementDTO.getOrdresTravail() != null) {
                equipement.setOrdresTravail(ordresTravailRepository.findAllByDescriptionIn(equipementDTO.getOrdresTravail()));
            }

            // Update piecesDetachees (if applicable)
            if (equipementDTO.getPiecesDetachees() != null) {
                equipement.setPiecesDetachees(pieceDetacheeRepository.findAllByNomIn(equipementDTO.getPiecesDetachees()));
            }
*/


            // Save updated equipement entity
            equipementRepository.save(equipement);

            // Return updated EquipementDTO
            return new EquipementDTO(equipement);
        } else {
            return null; // Equipement not found
        }
    }

    public List<PieceDetachee> getPiecesDetacheesByEquipementId(long equipementId) {
        Equipement equipement = equipementRepository.findById(equipementId);
        if (equipement != null) {
            return equipement.getPiecesDetachees(); // Returns the list of piecesDetachees
        }
        return Collections.emptyList(); // If equipement is not found, return an empty list
    }


}
