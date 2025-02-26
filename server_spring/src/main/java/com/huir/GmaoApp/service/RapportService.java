package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.Rapport;
import com.huir.GmaoApp.model.TypeRapport;
import com.huir.GmaoApp.repository.RapportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RapportService {

    @Autowired
    private RapportRepository rapportRepository;

    // Create or update a report
    public Rapport saveRapport(Rapport rapport) {
        return rapportRepository.save(rapport);
    }

    // Find reports by type
    public List<Rapport> findRapportsByType(TypeRapport type) {
        return rapportRepository.findByType(type);
    }

    // Get all reports
    public List<Rapport> findAllRapports() {
        return rapportRepository.findAll();
    }

    // Delete a report
    public void deleteRapport(Long id) {
        rapportRepository.deleteById(id);
    }
}
