package com.huir.GmaoApp.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.model.Statut;


@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
	 Optional<Maintenance> findById(Long id);
//	Optional<Maintenance> m = maintenanceRepository.findById(id); // ✅ CORRECT

	 //List<Maintenance> findByAffecteAId(Long affecteA);
	
	 List<Maintenance> findByAffecteAIdAndStatutNotIn(Long userId, List<Statut> statuses);
	 List<Maintenance> findByAffecteAId(Long id);
	
	
	 default Maintenance save2(Maintenance maintenance) {
	        // Exemple de vérification avant sauvegarde
	        if (maintenance.getStatut() == Statut.EN_ATTENTE) {
	            // Logique spécifique avant l'enregistrement
	            return save(maintenance); // Appel de la méthode save existante de JpaRepository
	        } else {
	            throw new IllegalArgumentException("Le statut ne permet pas l'enregistrement de cette maintenance.");
	        }
	    }
	
	
}