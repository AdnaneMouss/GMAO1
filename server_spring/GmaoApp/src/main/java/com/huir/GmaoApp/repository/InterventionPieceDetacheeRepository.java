package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.InterventionPieceDetachee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterventionPieceDetacheeRepository extends JpaRepository<InterventionPieceDetachee, Long> {

    List<InterventionPieceDetachee> findByInterventionId(Long interventionId);
}
