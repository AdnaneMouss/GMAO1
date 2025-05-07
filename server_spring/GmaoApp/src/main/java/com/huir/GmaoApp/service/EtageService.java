package com.huir.GmaoApp.service;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Batiment;
import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import com.huir.GmaoApp.repository.EtageRepository;
import com.huir.GmaoApp.repository.SallesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class EtageService {

    @Autowired
    private EtageRepository etageRepository;

    @Autowired
    private SallesRepository sallesRepository;

    public List<Salle> getSallesByEtageId(long etageId) {
        Etage etage = etageRepository.findById(etageId);
        if (etage != null) {
            return etage.getSalles();
        }
        return Collections.emptyList();
    }

    public Etage saveEtage(Etage etage) {
        return etageRepository.save(etage);
    }

    public boolean existsByNumAndBatimentId(int num, Long batimentId) {
        return etageRepository.existsByNumAndBatimentId(num, batimentId);
    }

    public Optional<Etage> getEtageById(Long id) {
        return etageRepository.findById(id);
    }


    public List<Salle> getSallesActivesByEtageId(Long etageId) {
        return sallesRepository.findByEtageIdAndActifTrue(etageId);
    }

    public List<Salle> getSallesInactivesByEtageId(Long etageId) {
        return sallesRepository.findByEtageIdAndActifFalse(etageId);
    }


    public boolean existsByNumAndBatimentIdAndActifTrue(int num, Long batimentId) {
        return etageRepository.existsByNumAndBatimentIdAndActifTrue(num, batimentId);
    }

}
