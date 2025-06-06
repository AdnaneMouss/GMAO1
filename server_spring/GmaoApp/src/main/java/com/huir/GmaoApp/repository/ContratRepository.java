package com.huir.GmaoApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huir.GmaoApp.model.Contrat;
@Repository
public interface ContratRepository extends JpaRepository<Contrat, Long> {
   // List<Contrat> findByFournisseurId(Long fournisseurId);
    
    List<Contrat> findByFournisseur_Id(Long id);

}
