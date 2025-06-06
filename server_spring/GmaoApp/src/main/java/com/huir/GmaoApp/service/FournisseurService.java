package com.huir.GmaoApp.service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.dto.ContratDTO;
import com.huir.GmaoApp.dto.FournisseurDTO;
import com.huir.GmaoApp.model.Fournisseur;
import com.huir.GmaoApp.repository.FournisseurRepository;

import jakarta.transaction.Transactional;

@Service
public class FournisseurService {
    @Autowired
    private FournisseurRepository fournisseurRepository;

    public List<Fournisseur> getAllFournisseurs() {
        return fournisseurRepository.findAll();
    }

    public Fournisseur saveFournisseur(Fournisseur fournisseur) {
        return fournisseurRepository.save(fournisseur);
    }

    public void deleteFournisseur(Long id) {
        fournisseurRepository.deleteById(id);
    }
    
    public Fournisseur addFournisseur(Fournisseur fournisseur) {
        return fournisseurRepository.save(fournisseur);
    }
    
    public Fournisseur getFournisseurById(Long id) {
        return fournisseurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));
    }
    
    
  
    public FournisseurDTO getFournisseurDtoById(Long id) {
        Fournisseur fournisseur = fournisseurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));

        FournisseurDTO dto = new FournisseurDTO();
        dto.setId(fournisseur.getId());
        dto.setNom(fournisseur.getNom());
        dto.setAdresse(fournisseur.getAdresse());
        dto.setEmail(fournisseur.getEmail());
        dto.setTelephone(fournisseur.getTelephone());
        dto.setCodepostal(fournisseur.getCodepostal());
        dto.setImage(fournisseur.getImage());
        dto.setType(fournisseur.getType());

        List<ContratDTO> contratDTOs = fournisseur.getContrats().stream().map(contrat -> {
            ContratDTO c = new ContratDTO();
            c.setId(contrat.getId());
            c.setNumeroContrat(contrat.getNumeroContrat());
            c.setDateDebut(contrat.getDateDebut());
            c.setDateFin(contrat.getDateFin());
            c.setType(contrat.getType());
            c.setMontant(contrat.getMontant());
            c.setDureeFormatee(contrat.getDureeFormatee());
            c.setDureeEnJours(contrat.getDureeEnJours());
            return c;
        }).collect(Collectors.toList());

        dto.setContrats(contratDTOs);

        return dto;
    }

   
    
   

    @Transactional
    public List<FournisseurDTO> getAllFournisseursDtoWithContrats() {
        List<Fournisseur> fournisseurs = fournisseurRepository.findAll(); // Lazy loading OK ici
        return fournisseurs.stream()
                .map(FournisseurDTO::new)
                .collect(Collectors.toList());
    }
    
   // @Transactional
   // public FournisseurDTO getFournisseurDtoById(Long id) {
     //   Fournisseur f = fournisseurRepository.findById(id)
       //     .orElseThrow(() -> new RuntimeException("Fournisseur introuvable avec ID : " + id));
        //return new FournisseurDTO(f);
    //}

    
    public Optional<Fournisseur> getFournisseursById(Long id) {
        return fournisseurRepository.findById(id);
    }

    public Fournisseur updateFournisseur(Fournisseur fournisseur) {
        return fournisseurRepository.save(fournisseur);
    }


}

