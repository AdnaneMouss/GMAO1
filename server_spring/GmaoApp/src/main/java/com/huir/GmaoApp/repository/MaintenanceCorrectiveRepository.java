package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.sun.tools.javac.Main;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceCorrectiveRepository extends JpaRepository<MaintenanceCorrective, Long> {

	List<MaintenanceCorrective> findByStatut(String statut);
	List<MaintenanceCorrective> findByAffecteAId(Long affecteA);
}