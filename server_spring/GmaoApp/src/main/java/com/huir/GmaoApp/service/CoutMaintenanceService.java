package com.huir.GmaoApp.service;

import com.huir.GmaoApp.model.CoutMaintenance;
import com.huir.GmaoApp.model.Intervention;
import com.huir.GmaoApp.repository.CoutMaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoutMaintenanceService {

    @Autowired
    private CoutMaintenanceRepository coutMaintenanceRepository;

    // Create or update a maintenance cost
    public CoutMaintenance saveCoutMaintenance(CoutMaintenance coutMaintenance) {
        return coutMaintenanceRepository.save(coutMaintenance);
    }

    // Find maintenance costs by intervention
    public List<CoutMaintenance> findCoutMaintenanceByIntervention(Intervention intervention) {
        return coutMaintenanceRepository.findByIntervention(intervention);
    }

    // Get all maintenance costs
    public List<CoutMaintenance> findAllCoutMaintenance() {
        return coutMaintenanceRepository.findAll();
    }

    public void deleteCoutMaintenance(Long id) {
     coutMaintenanceRepository.deleteById(id);
    }
}
