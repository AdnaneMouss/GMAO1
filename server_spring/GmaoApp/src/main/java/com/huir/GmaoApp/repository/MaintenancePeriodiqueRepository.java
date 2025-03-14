package com.huir.GmaoApp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.MaintenancePeriodique;
import com.huir.GmaoApp.model.frequence;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenancePeriodiqueRepository extends JpaRepository<MaintenancePeriodique, Long> {
 
	 Optional<MaintenancePeriodique> findById(Long id);


   
   
}