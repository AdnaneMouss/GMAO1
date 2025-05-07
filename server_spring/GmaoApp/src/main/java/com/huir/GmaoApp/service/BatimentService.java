package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.BatimentDTO;
import com.huir.GmaoApp.dto.EtageDTO;
import com.huir.GmaoApp.dto.SalleDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.BatimentRepository;
import com.huir.GmaoApp.repository.EtageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class BatimentService {

    @Autowired
    private BatimentRepository batimentRepository;
    @Autowired
    private EtageRepository etageRepository;

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

    public boolean existsByNum(int num) {
        return batimentRepository.existsByNumBatiment(num);
    }

    public Optional<Batiment> getBatimentById(Long id) {
        return batimentRepository.findById(id);
}

    public List<Batiment> getBatimentsActifs() {
        return batimentRepository.findByActifTrue();
    }

    public List<Batiment> getBatimentsInactifs() {
        return batimentRepository.findByActifFalse();
    }

    public List<Etage> getEtagesActifsByBatimentId(Long batimentId) {
        return etageRepository.findByBatimentIdAndActifTrue(batimentId);
    }

    public List<Etage> getEtagesInactifsByBatimentId(Long batimentId) {
        return etageRepository.findByBatimentIdAndActifFalse(batimentId);
    }


    public boolean existsByIntituleAndActifTrue(String intitule) {
        return batimentRepository.existsByIntituleAndActifTrue(intitule);
    }

    public boolean existsByNumAndActifTrue(int numBatiment) {
        return batimentRepository.existsByNumBatimentAndActifTrue(numBatiment);
    }

}
