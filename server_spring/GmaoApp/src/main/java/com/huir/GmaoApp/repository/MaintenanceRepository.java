package com.huir.GmaoApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huir.GmaoApp.model.Event;
import com.huir.GmaoApp.model.Maintenance;


@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
	 Optional<Maintenance> findById(Long id);
	 List<Maintenance> findByEvent(Event event);
}