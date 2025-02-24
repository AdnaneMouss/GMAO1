package com.huir.GmaoApp.service;


import com.huir.GmaoApp.dto.EquipementDTO;
import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.Attribut;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.ServicesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EquipementService {

    @Autowired
    private EquipementRepository equipementRepository;

    @Autowired
    private ServicesRepository serviceRepository;
    // Create or update an equipment
    public Equipement saveEquipement(Equipement equipement) {
        return equipementRepository.save(equipement);
    }

    // Find an equipment by ID
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
            equipement.setLocalisation(equipementDTO.getLocalisation());
            equipement.setStatut(equipementDTO.getStatut());
            equipement.setDateAchat(equipementDTO.getDateAchat());
            equipement.setDateMiseEnService(equipementDTO.getDateMiseEnService());
            equipement.setGarantie(equipementDTO.getGarantie());
            equipement.setDateDerniereMaintenance(equipementDTO.getDateDerniereMaintenance());
            equipement.setFrequenceMaintenance(equipementDTO.getFrequenceMaintenance());
            equipement.setHistoriquePannes(equipementDTO.getHistoriquePannes());
            equipement.setCoutAchat(equipementDTO.getCoutAchat());
            equipement.setImage(equipementDTO.getImage());

            // Update the service and responsable maintenance if present
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

            // Update dynamic attributes
            if (equipementDTO.getAttributs() != null) {
                equipement.setAttributs(equipementDTO.getAttributs().stream()
                        .map(attrDTO -> new Attribut(attrDTO.getNom(), attrDTO.getValeur(), equipement))
                        .collect(Collectors.toList()));
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


}
