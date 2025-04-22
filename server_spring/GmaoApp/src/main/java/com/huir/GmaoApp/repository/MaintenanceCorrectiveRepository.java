package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.model.Statut;
import com.sun.tools.javac.Main;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceCorrectiveRepository extends JpaRepository<MaintenanceCorrective, Long> {

	List<MaintenanceCorrective> findByStatut(String statut);
	List<MaintenanceCorrective> findByAffecteAId(Long affecteA);
	List<MaintenanceCorrective> findByAffecteAIdAndStatutNotIn(Long technicianId, List<Statut> statuses);

    boolean existsByEquipementAndStatutIn(Equipement equipement, List<Statut> enAttente);

	boolean existsByEquipementAndStatutInAndIdNot(Equipement equipement, List<Statut> enAttente, Long maintenanceId);
}