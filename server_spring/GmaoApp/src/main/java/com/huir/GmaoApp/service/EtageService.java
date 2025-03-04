package com.huir.GmaoApp.service;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import com.huir.GmaoApp.repository.EtageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;


@Service
public class EtageService {

    @Autowired
    private EtageRepository etageRepository;

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

}
