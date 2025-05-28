package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.AttributEquipementsDTO;
import com.huir.GmaoApp.model.AttributEquipementType;
import com.huir.GmaoApp.model.AttributEquipementValeur;
import com.huir.GmaoApp.model.AttributEquipements;
import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.repository.AttributEquipementsRepository;
import com.huir.GmaoApp.repository.AttributEquipementsValeursRepository;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.TypesEquipementsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttributEquipementsValeurService {

    private final AttributEquipementsValeursRepository attributEquipementsValeurRepository;

    public List<AttributEquipementValeur> findByEquipement(Equipement equipement) {
        return attributEquipementsValeurRepository.findByEquipement(equipement);
    }

    public List<AttributEquipementValeur> findByEquipementId(Long equipementId) {
        return attributEquipementsValeurRepository.findByEquipementId(equipementId);
    }
}