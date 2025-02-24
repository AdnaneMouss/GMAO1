package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.Intervention;
import com.huir.GmaoApp.model.User;
import com.huir.GmaoApp.repository.InterventionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    // Get all interventions by technician
    public List<Intervention> findInterventionsByTechnician(User technicien) {
        return interventionRepository.findByTechnicien(technicien);
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
