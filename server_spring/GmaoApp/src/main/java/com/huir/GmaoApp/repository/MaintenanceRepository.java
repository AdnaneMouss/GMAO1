package com.huir.GmaoApp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.User;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
	 Optional<Maintenance> findById(Long id);
}