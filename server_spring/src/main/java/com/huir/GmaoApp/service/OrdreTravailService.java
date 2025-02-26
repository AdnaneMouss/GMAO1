package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.OrdreTravail;
import com.huir.GmaoApp.model.StatutOrdre;
import com.huir.GmaoApp.repository.OrdreTravailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdreTravailService {

    @Autowired
    private OrdreTravailRepository ordreTravailRepository;

    // Create or update an order
    public OrdreTravail saveOrdreTravail(OrdreTravail ordreTravail) {
        return ordreTravailRepository.save(ordreTravail);
    }

    // Find an order by ID
    public Optional<OrdreTravail> findOrdreTravailById(Long id) {
        return ordreTravailRepository.findById(id);
    }

    // Get all orders by status
    public List<OrdreTravail> findOrdresTravailByStatus(StatutOrdre statut) {
        return ordreTravailRepository.findByStatut(statut);
    }

    // Get all orders
    public List<OrdreTravail> findAllOrdresTravail() {
        return ordreTravailRepository.findAll();
    }

    // Delete an order
    public void deleteOrdreTravail(Long id) {
        ordreTravailRepository.deleteById(id);
    }
}
