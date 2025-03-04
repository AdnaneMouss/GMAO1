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

}
