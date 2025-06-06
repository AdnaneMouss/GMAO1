package com.huir.GmaoApp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.model.Contrat;
import com.huir.GmaoApp.model.Fournisseur;
import com.huir.GmaoApp.repository.ContratRepository;
import com.huir.GmaoApp.repository.FournisseurRepository;

@Service
public class ContratService {
    @Autowired
    private ContratRepository contratRepository;
    @Autowired
    private FournisseurRepository fournisseurRepository;


    public List<Contrat> getContratsByFournisseur(Long fournisseurId) {
        return contratRepository.findByFournisseur_Id(fournisseurId);
    }

    public Contrat saveContrat(Contrat contrat) {
        if (contrat.getFournisseur() == null && contrat.getFournisseurId() != null) {
            Fournisseur fournisseur = fournisseurRepository.findById(contrat.getFournisseurId())
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé"));

            contrat.setFournisseur(fournisseur);
        }

        // Ne pas modifier le champ fichierPdf ici !
        return contratRepository.save(contrat);
    }


    public void deleteContrat(Long id) {
        contratRepository.deleteById(id);
    }
}
