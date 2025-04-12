package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.IndiceDTO;
import com.huir.GmaoApp.dto.MaintenanceDTO;
import com.huir.GmaoApp.model.AttributEquipementValeur;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Indice;
import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.AttributEquipementsValeursRepository;
import com.huir.GmaoApp.repository.IndiceRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IndiceService {
	
	@Autowired
	private AttributEquipementsRepository attributEquipementsRepository;
	@Autowired
	private AttributEquipementsValeursRepository attributEquipementsValeursRepository;



	@Autowired
    private final IndiceRepository indiceRepository;
    
    public IndiceService(IndiceRepository indiceRepository) {
        this.indiceRepository = indiceRepository;
    }

    
    public List<Indice> findAllIndices() {
        return indiceRepository.findAll();
    }
    public Optional<Indice> findIndiceById(Long id) {
        return indiceRepository.findById(id);
    }
    
 

  
    public Indice saveIndice(Indice indice) {
        return indiceRepository.save(indice);
    }

   
    @Transactional
    public IndiceDTO updateIndice(Long id, IndiceDTO indiceDTO) {
        Optional<Indice> optionalIndice = indiceRepository.findById(id);

        if (optionalIndice.isPresent()) {
            Indice indice = optionalIndice.get();

            // Vérification de l'unicité de l'indice (par exemple, vérification du nom)
            
            // Mise à jour des attributs
            indice.setNomIndice(indiceDTO.getNomIndice());
            indice.setSeuilIndice(indiceDTO.getSeuilIndice());

            // Sauvegarde de l'indice mis à jour
            indiceRepository.save(indice);
            return new IndiceDTO(indice);
        } else {
            throw new RuntimeException("Indice non trouvé avec ID : " + id);
        }
    }
    
    // Méthode pour ajouter une maintenance
    @Transactional
    public void addIndice(IndiceDTO indicedto) {
        Indice indice = new Indice();
        indice.setNomIndice(indicedto.getNomIndice());
        indice.setSeuilIndice(indicedto.getSeuilIndice());
      
        indice.setEquipementId(indicedto.getEquipementId());
        indiceRepository.save(indice);
    }
    
    
   
        

    
   

    /**
     * Supprime un indice en fonction de son ID. indiceR
     * 
     * @param id L'ID de l'indice à supprimer.
     */
    @Transactional
    public void deleteIndice(Long id) {
        if (indiceRepository.existsById(id)) {
            indiceRepository.deleteById(id);
        } else {
            throw new RuntimeException("Indice non trouvé avec ID : " + id);
        }
    }
}
