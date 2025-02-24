package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PieceDetacheeService {

    @Autowired
    private PieceDetacheeRepository pieceDetacheeRepository;

    // Create or update a spare part
    public PieceDetachee savePieceDetachee(PieceDetachee pieceDetachee) {
        return pieceDetacheeRepository.save(pieceDetachee);
    }

    // Find a spare part by ID
    public Optional<PieceDetachee> findPieceDetacheeById(Long id) {
        return pieceDetacheeRepository.findById(id);
    }

    // Find a spare part by name
    public PieceDetachee findPieceDetacheeByName(String name) {
        return pieceDetacheeRepository.findByNom(name);
    }

    // Get all spare parts
    public List<PieceDetachee> findAllPiecesDetachees() {
        return pieceDetacheeRepository.findAll();
    }

    // Delete a spare part
    public void deletePieceDetachee(Long id) {
        pieceDetacheeRepository.deleteById(id);
    }
}
