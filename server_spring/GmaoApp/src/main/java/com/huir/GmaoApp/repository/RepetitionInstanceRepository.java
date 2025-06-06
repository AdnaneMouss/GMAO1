package com.huir.GmaoApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huir.GmaoApp.model.RepetitionInstance;
@Repository
public interface RepetitionInstanceRepository extends JpaRepository<RepetitionInstance, Long> {
	List<RepetitionInstance> findByMaintenance_Id(Long maintenanceId);
	default List<RepetitionInstance> getAllRepetitions() {
        return findAll();


}
}