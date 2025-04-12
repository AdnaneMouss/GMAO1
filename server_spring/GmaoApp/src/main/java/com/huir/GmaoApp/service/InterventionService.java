package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.InterventionDTO;
import com.huir.GmaoApp.model.Intervention;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.InterventionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InterventionService {

    @Autowired
    private InterventionRepository interventionRepository;

    // Create or update an intervention
    public Intervention saveIntervention(Intervention intervention) {
        return interventionRepository.save(intervention);
    }

    // Find an intervention by ID
    public Optional<Intervention> findInterventionById(Long id) {
        return interventionRepository.findById(id);
    }


    public List<InterventionDTO> getInterventionsByTechnicien(Long technicienId) {
        return interventionRepository.findByTechnicienId(technicienId).stream()
                .map(InterventionDTO::new)
                .collect(Collectors.toList());
    }

    public Intervention save(Intervention intervention) {
        return interventionRepository.save(intervention);
    }

    public List<PieceDetachee> getPiecesByInterventionId(Long interventionId) {
        return interventionRepository.findPiecesByInterventionId(interventionId);
    }

    // Get all interventions
    public List<Intervention> findAllInterventions() {
        return interventionRepository.findAll();
    }

    // Delete an intervention
    public void deleteIntervention(Long id) {
        interventionRepository.deleteById(id);
    }
}
