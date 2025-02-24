package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.CoutMaintenance;
import com.huir.GmaoApp.model.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoutMaintenanceRepository extends JpaRepository<CoutMaintenance, Long> {
    List<CoutMaintenance> findByIntervention(Intervention intervention);
}
