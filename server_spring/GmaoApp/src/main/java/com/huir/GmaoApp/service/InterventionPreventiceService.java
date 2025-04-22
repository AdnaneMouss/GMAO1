package com.huir.GmaoApp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.dto.InterventionPreventiveDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.repository.InterventionPreventiveRepository;

@Service
public class InterventionPreventiceService {
	@Autowired
    private  InterventionPreventiveRepository InterventionPreventiveRepository;

    // Create or update an intervention
    public InterventionPreventive saveIntervention(InterventionPreventive InterventionPreventive) {
        return InterventionPreventiveRepository.save(InterventionPreventive);
    }

    // Find an intervention by ID
    public Optional<InterventionPreventive> findInterventionById(Long id) {
        return InterventionPreventiveRepository.findById(id);
    }


    public List<InterventionPreventiveDTO> getInterventionsByTechnicien(Long technicienId) {
        return InterventionPreventiveRepository.findByTechnicienId(technicienId).stream()
                .map(InterventionPreventiveDTO::new)
                .collect(Collectors.toList());
    }

    public InterventionPreventive save(InterventionPreventive InterventionPreventive) {
        return InterventionPreventiveRepository.save(InterventionPreventive);
    }

    public List<PieceDetachee> getPiecesByInterventionId(Long interventionPreventiveId) {
        return InterventionPreventiveRepository.findPiecesByInterventionId(interventionPreventiveId);
    }

    // Get all interventions
    @Transactional
    public List<InterventionPreventive> getAllInterventions() {
        List<InterventionPreventive> interventions = InterventionPreventiveRepository.findAll();
        interventions.forEach(intervention -> Hibernate.initialize(intervention.getPhotos()));
        return interventions;
    }

    // Delete an intervention
    public void deleteIntervention(Long id) {
    	InterventionPreventiveRepository.deleteById(id);
    }
}

