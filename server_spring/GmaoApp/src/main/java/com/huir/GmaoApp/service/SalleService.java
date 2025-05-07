package com.huir.GmaoApp.service;
import com.huir.GmaoApp.model.Etage;
import com.huir.GmaoApp.model.Salle;
import com.huir.GmaoApp.repository.EtageRepository;
import com.huir.GmaoApp.repository.SallesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;


@Service
public class SalleService {

    @Autowired
    private SallesRepository sallesRepository;


    public Salle saveSalle(Salle salle) {
        return sallesRepository.save(salle);
    }

    public boolean existsByNumAndEtageId(int num, Long etageId) {
        return sallesRepository.existsByNumAndEtageId(num, etageId);
    }

    public List<Salle> getSallesActifs() {
        return sallesRepository.findByActifTrue();
    }

    public List<Salle> getSallesInactifs() {
        return sallesRepository.findByActifFalse();
    }


    public boolean existsByPrefixeAndNumAndEtageIdAndActifTrue(String prefixe, Integer num, Long etageId) {
        return sallesRepository.existsByPrefixeAndNumAndEtageIdAndActifTrue(prefixe,num,etageId);
    }


}
