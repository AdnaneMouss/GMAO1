package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.BatimentDTO;
import com.huir.GmaoApp.dto.EtageDTO;
import com.huir.GmaoApp.dto.SalleDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.BatimentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class BatimentService {

    @Autowired
    private BatimentRepository batimentRepository;

    public List<Batiment> getAllBatiments() {
        return batimentRepository.findAll();
    }

    public List<Etage> getEtagesByBatimentId(long batId) {
        Batiment bat = batimentRepository.findById(batId);
        if (bat != null) {
            return bat.getEtages();
        }
        return Collections.emptyList();
    }

    public Batiment addBatiment(Batiment batiment) {
        return batimentRepository.save(batiment);
    }

    public boolean existsByIntitule(String nom) {
        return batimentRepository.existsByIntitule(nom);
    }

    public boolean existsByNum(int num) { return batimentRepository.existsByNumBatiment(num);
    }

}
